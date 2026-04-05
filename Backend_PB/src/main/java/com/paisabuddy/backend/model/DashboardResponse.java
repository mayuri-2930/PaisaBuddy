package com.paisabuddy.backend.model;

public class DashboardResponse {

    private Double income;
    private Double expenses;
    private Double reserved;
    private Double balance;

    public DashboardResponse(Double income, Double expenses, Double reserved, Double balance) {
        this.income = income;
        this.expenses = expenses;
        this.reserved = reserved;
        this.balance = balance;
    }

    public Double getIncome() { return income; }
    public Double getExpenses() { return expenses; }
    public Double getReserved() { return reserved; }
    public Double getBalance() { return balance; }
}