package com.paisabuddy.backend.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.dto.DashboardResponse;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.GoalContributionRepository;
import com.paisabuddy.backend.repository.GoalRepository;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepo;
    private final ReservedService reservedService;
    private final GoalRepository goalRepo;
    private final GoalContributionRepository contributionRepo;

    public DashboardService(TransactionRepository transactionRepo,
                            ReservedService reservedService,
                            GoalRepository goalRepo,
                            GoalContributionRepository contributionRepo) {
        this.transactionRepo = transactionRepo;
        this.reservedService = reservedService;
        this.goalRepo = goalRepo;
        this.contributionRepo = contributionRepo;
    }

    public DashboardResponse getDashboard(User user) {
        LocalDate today = LocalDate.now();

        // Base salary + any manual CREDIT transactions this month (bonus, freelance, etc.)
        double monthlySalary   = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 0;
        double extraCredits    = currentMonthCredits(user, today);
        double totalBalance    = monthlySalary + extraCredits;

        // Only DEBIT transactions count as "spent"
        double totalSpent      = currentMonthDebits(user, today);

        // Current month reserved (PENDING entries due this month)
        double totalReserved   = reservedService.getCurrentMonthReservedTotal(user);

        // Goal savings contributed this month
        double goalSaved       = currentMonthGoalSavings(user, today);

        long   activeGoals     = goalRepo.findByUser(user).size();

        double spendable       = Math.max(totalBalance - totalSpent - totalReserved - goalSaved, 0);

        return new DashboardResponse(totalBalance, totalSpent, totalReserved, goalSaved, spendable, activeGoals);
    }

    /** Reusable spendable check used by TransactionService and GoalService. */
    public double getSpendable(User user) {
        LocalDate today = LocalDate.now();
        double monthlySalary = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 0;
        double extraCredits  = currentMonthCredits(user, today);
        double totalBalance  = monthlySalary + extraCredits;
        double totalSpent    = currentMonthDebits(user, today);
        double totalReserved = reservedService.getCurrentMonthReservedTotal(user);
        double goalSaved     = currentMonthGoalSavings(user, today);
        return Math.max(totalBalance - totalSpent - totalReserved - goalSaved, 0);
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private double currentMonthDebits(User user, LocalDate today) {
        return transactionRepo
                .findDebitsByUserAndMonth(user, today.getYear(), today.getMonthValue())
                .stream().mapToDouble(t -> t.getAmount()).sum();
    }

    private double currentMonthCredits(User user, LocalDate today) {
        // Manual CREDIT entries (bonus, freelance, etc.) — NOT counting monthly salary
        // since salary is already in user.monthlyIncome
        return transactionRepo
                .findCreditsByUserAndMonth(user, today.getYear(), today.getMonthValue())
                .stream()
                .filter(t -> !t.getCategory().equals("Salary")) // salary already in monthlyIncome
                .mapToDouble(t -> t.getAmount()).sum();
    }

    private double currentMonthGoalSavings(User user, LocalDate today) {
        return contributionRepo.findAll().stream()
                .filter(c -> c.getGoal().getUser().getId().equals(user.getId()))
                .filter(c -> {
                    if (c.getContributedAt() == null) return false;
                    return c.getContributedAt().getYear() == today.getYear()
                        && c.getContributedAt().getMonthValue() == today.getMonthValue();
                })
                .mapToDouble(c -> c.getAmount())
                .sum();
    }
}