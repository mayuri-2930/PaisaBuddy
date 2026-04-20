package com.paisabuddy.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.paisabuddy.backend.dto.GoalContributionResponse;
import com.paisabuddy.backend.dto.GoalResponse;
import com.paisabuddy.backend.model.Goal;
import com.paisabuddy.backend.model.GoalContribution;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.GoalContributionRepository;
import com.paisabuddy.backend.repository.GoalRepository;

@Service
public class GoalService {

    private final GoalRepository goalRepo;
    private final GoalContributionRepository contributionRepo;
    private final UserService userService;

    public GoalService(GoalRepository goalRepo,
                       GoalContributionRepository contributionRepo,
                       UserService userService) {
        this.goalRepo = goalRepo;
        this.contributionRepo = contributionRepo;
        this.userService = userService;
    }

    // =========================
    // SAFE USER EXTRACTION
    // =========================
    private User getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("AUTH_NOT_FOUND_IN_SECURITY_CONTEXT");
        }

        String email = auth.getName().trim();

        return userService.getUserByEmail(email);
    }

    // =========================
    // CREATE GOAL
    // =========================
    public Goal createGoal(Goal goal) {
        User user = getCurrentUser();

        goal.setUser(user);
        return goalRepo.save(goal);
    }

    // =========================
    // GET GOALS
    // =========================
    public List<Goal> getGoals() {

        User user = getCurrentUser();

        return goalRepo.findByUser(user);
    }

    public List<GoalResponse> getGoalSummaries() {
        return getGoals().stream()
                .map(this::toGoalResponse)
                .collect(Collectors.toList());
    }

    // =========================
    // CONTRIBUTE TO GOAL
    // =========================
    public GoalContribution contribute(Long goalId, Double amount) {

        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("GOAL_NOT_FOUND: " + goalId));

        GoalContribution contribution = new GoalContribution(amount, goal);

        return contributionRepo.save(contribution);
    }

    public GoalResponse contributeAndSummarize(Long goalId, Double amount) {

        if (amount == null || amount <= 0) {
            throw new RuntimeException("CONTRIBUTION_AMOUNT_MUST_BE_POSITIVE");
        }

        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("GOAL_NOT_FOUND: " + goalId));

        User user = getCurrentUser();

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("GOAL_DOES_NOT_BELONG_TO_USER");
        }

        contributionRepo.save(new GoalContribution(amount, goal));

        return toGoalResponse(goal);
    }

    // =========================
    // TOTAL SAVED AMOUNT
    // =========================
    public Double getSavedAmount(Long goalId) {

        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("GOAL_NOT_FOUND: " + goalId));

        return contributionRepo.findByGoal(goal)
                .stream()
                .mapToDouble(GoalContribution::getAmount)
                .sum();
    }

    public Double getTotalSavedAcrossGoals(User user) {
        return goalRepo.findByUser(user)
                .stream()
                .mapToDouble(goal -> getSavedAmount(goal.getId()))
                .sum();
    }

    public GoalResponse toGoalResponse(Goal goal) {

        List<GoalContribution> contributions = contributionRepo.findByGoal(goal);

        double totalSaved = contributions.stream()
                .mapToDouble(GoalContribution::getAmount)
                .sum();
        double targetAmount = goal.getTargetAmount() != null ? goal.getTargetAmount() : 0;
        double remainingAmount = Math.max(targetAmount - totalSaved, 0);
        double progressPercent = targetAmount > 0
                ? Math.min((totalSaved / targetAmount) * 100, 100)
                : 0;
        List<GoalContributionResponse> contributionResponses = contributions.stream()
                .map(contribution -> new GoalContributionResponse(
                        contribution.getId(),
                        contribution.getAmount(),
                        contribution.getContributedAt()
                ))
                .collect(Collectors.toList());

        return new GoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getTargetAmount(),
                goal.getTargetDate(),
                goal.getCreatedAt(),
                totalSaved,
                remainingAmount,
                progressPercent,
                contributionResponses
        );
    }
}
