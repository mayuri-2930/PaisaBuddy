package com.paisabuddy.backend.dto;

import java.time.LocalDateTime;

public class GoalContributionResponse {

    private Long id;
    private Double amount;
    private LocalDateTime contributedAt;

    public GoalContributionResponse(Long id, Double amount, LocalDateTime contributedAt) {
        this.id = id;
        this.amount = amount;
        this.contributedAt = contributedAt;
    }

    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public LocalDateTime getContributedAt() {
        return contributedAt;
    }
}
