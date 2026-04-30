package com.paisabuddy.backend.service;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.dto.DashboardResponse;
import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.GoalContributionRepository;
import com.paisabuddy.backend.repository.GoalRepository;
import com.paisabuddy.backend.repository.ReservedRepository;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepo;
    private final ReservedRepository reservedRepo;
    private final GoalRepository goalRepo;
    private final GoalContributionRepository contributionRepo;

    public DashboardService(TransactionRepository transactionRepo,
                            ReservedRepository reservedRepo,
                            GoalRepository goalRepo,
                            GoalContributionRepository contributionRepo) {
        this.transactionRepo = transactionRepo;
        this.reservedRepo = reservedRepo;
        this.goalRepo = goalRepo;
        this.contributionRepo = contributionRepo;
    }

    public DashboardResponse getDashboard(User user) {

        // 💰 Income
        double totalBalance = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 0;

        // 📉 Spent
        double totalSpent = transactionRepo.findByUser(user)
                .stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        // 🧾 Reserved
        double totalReserved = reservedRepo.findByUser(user)
                .stream()
                .filter(r -> r.getStatus() == Reserved.Status.PENDING)
                .mapToDouble(Reserved::getAmount)
                .sum();

        // 🎯 Goal Saved (FIXED MISSING PART)
        double goalSaved = contributionRepo.findAll()
                .stream()
                .filter(c -> c.getGoal().getUser().getId().equals(user.getId()))
                .mapToDouble(c -> c.getAmount())
                .sum();

        // 🎯 Active Goals
        long activeGoals = goalRepo.findByUser(user).size();

        // 💸 Spendable
        double spendable = totalBalance - totalSpent - totalReserved - goalSaved;

        if (spendable < 0) spendable = 0;

        return new DashboardResponse(
                totalBalance,
                totalSpent,
                totalReserved,
                goalSaved,
                spendable,
                activeGoals
        );
    }
}