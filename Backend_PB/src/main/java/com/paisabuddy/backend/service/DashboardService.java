package com.paisabuddy.backend.service;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.DashboardResponse;
import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.ReservedRepository;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepo;
    private final ReservedRepository reservedRepo;
    private final UserService userService;

    public DashboardService(TransactionRepository transactionRepo,
                            ReservedRepository reservedRepo,
                            UserService userService) {
        this.transactionRepo = transactionRepo;
        this.reservedRepo = reservedRepo;
        this.userService = userService;
    }

    public DashboardResponse getDashboard(Long userId) {

        User user = userService.getUserById(userId);

        // ✅ Total Spent
        double totalSpent = transactionRepo.findByUser(user)
                .stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        // ✅ Total Reserved (only pending)
        double totalReserved = reservedRepo.findByUser(user)
                .stream()
                .filter(r -> r.getStatus() == Reserved.Status.PENDING)
                .mapToDouble(Reserved::getAmount)
                .sum();

        // ✅ Monthly Income
        double income = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 0;

        // ✅ Remaining Balance
        double remainingBalance = income - (totalSpent + totalReserved);

        return new DashboardResponse(
                totalSpent,
                totalReserved,
                remainingBalance,
                income
        );
    }
}