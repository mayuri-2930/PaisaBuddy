package com.paisabuddy.backend.model;

public class DashboardResponse {

    private Double totalSpent;
    private Double totalReserved;
    private Double remainingBalance;
    private Double monthlyIncome;

    public DashboardResponse(Double totalSpent, Double totalReserved, Double remainingBalance, Double monthlyIncome) {
        this.totalSpent = totalSpent;
        this.totalReserved = totalReserved;
        this.remainingBalance = remainingBalance;
        this.monthlyIncome = monthlyIncome;
    }

    public Double getTotalSpent() { return totalSpent; }
    public Double getTotalReserved() { return totalReserved; }
    public Double getRemainingBalance() { return remainingBalance; }
    public Double getMonthlyIncome() { return monthlyIncome; }
}