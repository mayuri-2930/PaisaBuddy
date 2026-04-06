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

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ✅ Add transaction
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("AUTH: " + auth);

        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            System.out.println("AUTH FAILED");
            return ResponseEntity.status(401).build();
        }

        User user = (User) auth.getPrincipal();

        System.out.println("AUTH USER: " + user.getEmail());

        Transaction savedTransaction = transactionService.addTransaction(user.getId(), transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    // ✅ Get transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).build();
        }

        User user = (User) auth.getPrincipal();

        List<Transaction> transactions = transactionService.getTransactions(user.getId());
        return ResponseEntity.ok(transactions);
    }
}
