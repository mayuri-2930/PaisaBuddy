package com.paisabuddy.backend.dto;

public class DashboardResponse {

    private Double totalBalance;
    private Double totalSpent;
    private Double totalReserved;
    private Double totalGoalSavings;
    private Double spendable;
    private String budgetHealth;

    public DashboardResponse(Double totalBalance,
                             Double totalSpent,
                             Double totalReserved,
                             Double totalGoalSavings,
                             Double spendable,
                             String budgetHealth) {
        this.totalBalance = totalBalance;
        this.totalSpent = totalSpent;
        this.totalReserved = totalReserved;
        this.totalGoalSavings = totalGoalSavings;
        this.spendable = spendable;
        this.budgetHealth = budgetHealth;
    }

    public Double getTotalBalance() { return totalBalance; }

    public Double getTotalSpent() { return totalSpent; }

    public Double getTotalReserved() { return totalReserved; }

    public Double getTotalGoalSavings() { return totalGoalSavings; }

    public Double getSpendable() { return spendable; }

    public String getBudgetHealth() { return budgetHealth; }
}
