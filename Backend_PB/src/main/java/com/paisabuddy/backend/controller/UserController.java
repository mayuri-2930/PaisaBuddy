package com.paisabuddy.backend.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.service.TransactionService;
import com.paisabuddy.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TransactionService transactionService;

    public UserController(UserService userService, TransactionService transactionService) {
        this.userService = userService;
        this.transactionService = transactionService;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    /**
     * Update salary. If new salary > old, the difference is added to spendable
     * via a CREDIT transaction so it shows in history.
     * If new salary < old, the difference is noted but spendable adjusts automatically
     * since DashboardService uses current monthlyIncome as base.
     */
    @PutMapping("/{id}/income")
    public ResponseEntity<User> updateIncome(@PathVariable Long id, @RequestBody Double income) {
        User user = userService.getUserById(id);
        double oldIncome = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 0;
        double diff = income - oldIncome;

        user = userService.updateIncome(id, income);

        if (diff > 0) {
            // Salary increased — record the extra amount as a CREDIT transaction
            Transaction credit = new Transaction();
            credit.setAmount(diff);
            credit.setCategory("Salary");
            credit.setDescription("Salary increment: +" + String.format("₹%.0f", diff));
            credit.setType(Transaction.Type.CREDIT);
            credit.setDate(LocalDate.now());
            credit.setUser(user);
            transactionService.addCredit(user.getId(), credit);
        }
        // If salary decreased: spendable auto-recalculates since monthlyIncome is now lower.
        // No extra transaction needed — the lower base simply reduces spendable.

        return ResponseEntity.ok(user);
    }

    /**
     * Add a manual credit (bonus, freelance income, etc.).
     * Stored as a CREDIT transaction — adds to spendable and shows in history.
     */
    @PostMapping("/credit")
    public ResponseEntity<Transaction> addCredit(@RequestBody CreditRequest req) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        Transaction credit = new Transaction();
        credit.setAmount(req.amount);
        credit.setCategory(req.category != null ? req.category : "Credit");
        credit.setDescription(req.description != null ? req.description : "Manual credit");
        credit.setType(Transaction.Type.CREDIT);
        credit.setDate(LocalDate.now());

        Transaction saved = transactionService.addCredit(user.getId(), credit);
        return ResponseEntity.ok(saved);
    }

    // ── Auth helper ───────────────────────────────────────────────────────
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userService.findUserByEmail(auth.getName()).orElse(null);
    }

    // ── DTOs ─────────────────────────────────────────────────────────────
    public static class CreditRequest {
        public Double amount;
        public String category;
        public String description;
    }
}