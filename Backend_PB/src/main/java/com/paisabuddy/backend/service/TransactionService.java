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
    private final DashboardService dashboardService;

    public TransactionService(TransactionRepository transactionRepository,
                              UserService userService,
                              DashboardService dashboardService) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
        this.dashboardService = dashboardService;
    }

    /** Add a DEBIT transaction — blocked if spendable is insufficient. */
    public Transaction addTransaction(Long userId, Transaction transaction) {
        User user = userService.getUserById(userId);

        // Default to DEBIT if not set
        if (transaction.getType() == null) {
            transaction.setType(Transaction.Type.DEBIT);
        }

        // Only enforce spendable check for DEBIT transactions
        if (transaction.getType() == Transaction.Type.DEBIT) {
            double spendable = dashboardService.getSpendable(user);
            if (spendable <= 0) {
                throw new RuntimeException("INSUFFICIENT_SPENDABLE_BALANCE");
            }
            if (transaction.getAmount() > spendable) {
                throw new RuntimeException("AMOUNT_EXCEEDS_SPENDABLE_BALANCE");
            }
        }

        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    /** Add a CREDIT transaction (bonus, freelance, etc.) — no spendable check needed. */
    public Transaction addCredit(Long userId, Transaction transaction) {
        User user = userService.getUserById(userId);
        transaction.setType(Transaction.Type.CREDIT);
        transaction.setUser(user);
        if (transaction.getDate() == null) transaction.setDate(LocalDate.now());
        if (transaction.getCategory() == null) transaction.setCategory("Credit");
        return transactionRepository.save(transaction);
    }

    /** Get all transactions for a user, sorted latest first. */
    public List<Transaction> getTransactions(Long userId) {
        User user = userService.getUserById(userId);
        List<Transaction> all = transactionRepository.findByUser(user);
        all.sort((a, b) -> {
            java.time.LocalDateTime ta = a.getCreatedAt() != null ? a.getCreatedAt() : a.getDate().atStartOfDay();
            java.time.LocalDateTime tb = b.getCreatedAt() != null ? b.getCreatedAt() : b.getDate().atStartOfDay();
            return tb.compareTo(ta);
        });
        return all;
    }
}