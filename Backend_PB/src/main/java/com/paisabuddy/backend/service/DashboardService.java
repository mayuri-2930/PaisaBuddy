package com.paisabuddy.backend.service;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.dto.DashboardResponse;
import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.ReservedRepository;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepo;
    private final ReservedRepository reservedRepo;
    private final GoalService goalService;

    public DashboardService(TransactionRepository transactionRepo,
                            ReservedRepository reservedRepo,
                            GoalService goalService) {
        this.transactionRepo = transactionRepo;
        this.reservedRepo = reservedRepo;
        this.goalService = goalService;
    }

    public DashboardResponse getDashboard(User user) {

        double totalBalance = user.getMonthlyIncome() != null
                ? user.getMonthlyIncome()
                : 0;

        double totalSpent = transactionRepo.findByUser(user)
                .stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalReserved = reservedRepo.findByUser(user)
                .stream()
                .filter(r -> r.getStatus() == Reserved.Status.PENDING)
                .mapToDouble(Reserved::getAmount)
                .sum();

        double totalGoalSavings = goalService.getTotalSavedAcrossGoals(user);

        double spendable = totalBalance - totalSpent - totalReserved - totalGoalSavings;

        if (spendable < 0) spendable = 0;

        double ratio = totalBalance > 0 ? spendable / totalBalance : 0;
        String budgetHealth = ratio > 0.4 ? "GREEN" : ratio > 0.15 ? "YELLOW" : "RED";

        return new DashboardResponse(
                totalBalance,
                totalSpent,
                totalReserved,
                totalGoalSavings,
                spendable,
                budgetHealth
        );
    }
}
