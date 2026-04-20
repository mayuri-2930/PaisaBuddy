// package com.paisabuddy.backend.model;

// import java.time.LocalDateTime;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;

// @Entity
// @Table(name = "goal_contributions")
// public class GoalContribution {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private Double amount;

//     private LocalDateTime contributedAt;

//     @ManyToOne
//     @JoinColumn(name = "goal_id")
//     private Goal goal;

//     public GoalContribution() {
//         this.contributedAt = LocalDateTime.now();
//     }

//     public GoalContribution(Double amount, Goal goal) {
//         this.amount = amount;
//         this.goal = goal;
//         this.contributedAt = LocalDateTime.now();
//     }

//     public Long getId() { return id; }

//     public Double getAmount() { return amount; }
//     public void setAmount(Double amount) { this.amount = amount; }

//     public LocalDateTime getContributedAt() { return contributedAt; }

//     public Goal getGoal() { return goal; }
//     public void setGoal(Goal goal) { this.goal = goal; }
// }

package com.paisabuddy.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "goal_contribution")
public class GoalContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private LocalDateTime contributedAt;

    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goal goal;

    public GoalContribution() {
        this.contributedAt = LocalDateTime.now();
    }

    public GoalContribution(Double amount, Goal goal) {
        this.amount = amount;
        this.goal = goal;
        this.contributedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getContributedAt() {
        return contributedAt;
    }

    public void setContributedAt(LocalDateTime contributedAt) {
        this.contributedAt = contributedAt;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }
}
