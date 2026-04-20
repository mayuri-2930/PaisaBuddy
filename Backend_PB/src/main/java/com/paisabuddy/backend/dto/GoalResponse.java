package com.paisabuddy.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class GoalResponse {

    private Long id;
    private String title;
    private Double targetAmount;
    private LocalDate targetDate;
    private LocalDateTime createdAt;
    private Double totalSaved;
    private Double remainingAmount;
    private Double progressPercent;
    private List<GoalContributionResponse> contributions;

    public GoalResponse(Long id,
                        String title,
                        Double targetAmount,
                        LocalDate targetDate,
                        LocalDateTime createdAt,
                        Double totalSaved,
                        Double remainingAmount,
                        Double progressPercent,
                        List<GoalContributionResponse> contributions) {
        this.id = id;
        this.title = title;
        this.targetAmount = targetAmount;
        this.targetDate = targetDate;
        this.createdAt = createdAt;
        this.totalSaved = totalSaved;
        this.remainingAmount = remainingAmount;
        this.progressPercent = progressPercent;
        this.contributions = contributions;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Double getTargetAmount() {
        return targetAmount;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Double getTotalSaved() {
        return totalSaved;
    }

    public Double getRemainingAmount() {
        return remainingAmount;
    }

    public Double getProgressPercent() {
        return progressPercent;
    }

    public List<GoalContributionResponse> getContributions() {
        return contributions;
    }
}
