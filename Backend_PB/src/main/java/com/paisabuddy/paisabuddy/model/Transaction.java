package com.paisabuddy.paisabuddy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;


@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Title is required")
    private String title;
    @Min(value = 0, message = "Amount must be positive")
    private double amount;
    @NotBlank(message = "Category is required")
    private String category;
    
    public Transaction() {}

    public Transaction(String title, double amount, String category) {
        this.title = title;
        this.amount = amount;
        this.category = category;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public double getAmount() { return amount; }
    public String getCategory() { return category; }

    public void setTitle(String title) { this.title = title; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setCategory(String category) { this.category = category; }
}