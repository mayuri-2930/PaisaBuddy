package com.paisabuddy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.DashboardResponse;
import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.ReservedRepository;
import com.paisabuddy.backend.repository.TransactionRepository;
import com.paisabuddy.backend.repository.UserRepository;

@Service
public class DashboardService {

    private final UserRepository userRepo;
    private final TransactionRepository transactionRepo;
    private final ReservedRepository reservedRepo;

    public DashboardService(UserRepository userRepo,
                            TransactionRepository transactionRepo,
                            ReservedRepository reservedRepo) {
        this.userRepo = userRepo;
        this.transactionRepo = transactionRepo;
        this.reservedRepo = reservedRepo;
    }

    public DashboardResponse getDashboard(Long userId) {

        User user = userRepo.findById(userId).orElseThrow();

        List<Transaction> transactions = transactionRepo.findByUser(user);
        List<Reserved> reservedList = reservedRepo.findByUserId(userId);

        double totalExpenses = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalReserved = reservedList.stream()
                .filter(r -> r.getStatus() == Reserved.Status.PENDING)
                .mapToDouble(Reserved::getAmount)
                .sum();

        double income = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 0;

        double balance = income - (totalExpenses + totalReserved);

        return new DashboardResponse(income, totalExpenses, totalReserved, balance);
    }
}