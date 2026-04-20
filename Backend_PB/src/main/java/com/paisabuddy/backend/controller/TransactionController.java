package com.paisabuddy.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.service.TransactionService;
import com.paisabuddy.backend.service.UserService;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;

    public TransactionController(TransactionService transactionService, UserService userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }

    // Add transaction
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {

        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        Transaction savedTransaction = transactionService.addTransaction(user.getId(), transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    // Get transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {

        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        List<Transaction> transactions = transactionService.getTransactions(user.getId());
        return ResponseEntity.ok(transactions);
    }

    // =========================
    // AUTH FIX (NO LOGIC CHANGE)
    // =========================
    private User getAuthenticatedUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) return null;

        String email = auth.getName();

        return userService.getUserByEmail(email);
    }
}