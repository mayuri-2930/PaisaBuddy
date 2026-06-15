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

    /** Add a DEBIT transaction. Blocked if spendable is insufficient. */
    @PostMapping
    public ResponseEntity<?> addTransaction(@RequestBody Transaction transaction) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();
        try {
            return ResponseEntity.ok(transactionService.addTransaction(user.getId(), transaction));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** Add a CREDIT transaction (bonus, freelance, etc.). Always allowed. */
    @PostMapping("/credit")
    public ResponseEntity<Transaction> addCredit(@RequestBody Transaction transaction) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(transactionService.addCredit(user.getId(), transaction));
    }

    /** All transactions sorted latest first. */
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(transactionService.getTransactions(user.getId()));
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userService.findUserByEmail(auth.getName()).orElse(null);
    }
}