package com.paisabuddy.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reserved")
public class Reserved {

    public enum Status {
        PENDING,
        PAID,
        UPCOMING   // future instances — not yet deducted from spendable
    }

    public enum Frequency {
        ONE_TIME,
        MONTHLY,
        QUARTERLY,
        YEARLY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Double amount;

    /** The date this specific instance is due */
    private LocalDate dueDate;

    /** The date the user actually paid (set when marked PAID) */
    private LocalDate paidDate;

    /** User-specified preferred payment date (day of month / exact date) */
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequency frequency = Frequency.ONE_TIME;

    /** Start date of the recurring schedule (null for ONE_TIME) */
    private LocalDate startDate;

    /** End date of the recurring schedule (null = end of year / ONE_TIME) */
    private LocalDate endDate;

    /**
     * For auto-generated recurring instances, points to the first/parent
     * Reserved entry so they can be grouped and displayed together.
     * Null for ONE_TIME or the parent itself.
     */
    private Long parentId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Reserved() {}

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Frequency getFrequency() { return frequency; }
    public void setFrequency(Frequency frequency) { this.frequency = frequency; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}