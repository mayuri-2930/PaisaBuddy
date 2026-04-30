package com.paisabuddy.backend.dto;

public class DashboardResponse {

    private Double totalBalance;
    private Double totalSpent;
    private Double totalReserved;
    private Double goalSaved;
    private Double spendable;
    private Long activeGoals;

    public DashboardResponse(Double totalBalance,
                             Double totalSpent,
                             Double totalReserved,
                             Double goalSaved,
                             Double spendable,
                             Long activeGoals) {
        this.totalBalance = totalBalance;
        this.totalSpent = totalSpent;
        this.totalReserved = totalReserved;
        this.goalSaved = goalSaved;
        this.spendable = spendable;
        this.activeGoals = activeGoals;
    }

    public Double getTotalBalance() { return totalBalance; }
    public Double getTotalSpent() { return totalSpent; }
    public Double getTotalReserved() { return totalReserved; }
    public Double getGoalSaved() { return goalSaved; }
    public Double getSpendable() { return spendable; }
    public Long getActiveGoals() { return activeGoals; }
}