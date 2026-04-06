package com.paisabuddy.backend.dto;

public class TransactionResponse {

    private Long id;
    private Double amount;
    private String category;
    private String description;

    public TransactionResponse(Long id, Double amount, String category, String description) {
        this.id = id;
        this.amount = amount;
        this.category = category;
        this.description = description;
    }

    public Long getId() { return id; }
    public Double getAmount() { return amount; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
}