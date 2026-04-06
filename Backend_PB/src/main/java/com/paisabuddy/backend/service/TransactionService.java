package com.paisabuddy.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public TransactionService(TransactionRepository transactionRepository, UserService userService) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    public Transaction addTransaction(Long userId, Transaction transaction) {

        System.out.println("=== ADD TRANSACTION START ===");

        if (userId == null) {
            throw new RuntimeException("UserId is null");
        }

        User user = userService.getUserById(userId);

        if (user == null) {
            throw new RuntimeException("User not found for ID: " + userId);
        }

        System.out.println("USER FOUND: " + user.getEmail());

        if (transaction.getAmount() == null) {
            throw new RuntimeException("Amount cannot be null");
        }

        if (transaction.getCategory() == null) {
            transaction.setCategory("General");
        }

        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }

        transaction.setUser(user);

        try {
            Transaction saved = transactionRepository.save(transaction);
            System.out.println("TRANSACTION SAVED: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.out.println("ERROR SAVING TRANSACTION:");
            e.printStackTrace();   // 🔴 THIS WILL SHOW REAL ERROR
            throw new RuntimeException("Transaction save failed");
        }
    }

    public List<Transaction> getTransactions(Long userId) {
        User user = userService.getUserById(userId);
        return transactionRepository.findByUser(user);
    }
}