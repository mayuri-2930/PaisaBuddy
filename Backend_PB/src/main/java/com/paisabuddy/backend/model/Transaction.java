package com.paisabuddy.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String description;

    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // Default constructor
    public Transaction() {
        this.date = LocalDate.now();
    }

    // Parameterized constructor
    public Transaction(Double amount, String category, String description, LocalDate date, User user) {
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.date = (date != null) ? date : LocalDate.now();
        this.user = user;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDate() {
        return date;
    }

    public User getUser() {
        return user;
    }

    // Setters
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setUser(User user) {
        this.user = user;
    }
}