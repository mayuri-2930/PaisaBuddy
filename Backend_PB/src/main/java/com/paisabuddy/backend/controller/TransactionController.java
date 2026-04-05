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
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Create transaction
    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return transactionService.addTransaction(user.getId(), transaction);
    }

    // Get transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        List<Transaction> list = transactionService.getTransactions(user.getId());
        return ResponseEntity.ok(list);
    }
}