package com.paisabuddy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final UserService userService; // if needed

    public TransactionService(TransactionRepository transactionRepository, UserService userService) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    public Transaction addTransaction(Long userId, Transaction transaction) {
        User user = userService.getUserById(userId); // fetch the User here
        transaction.setUser(user);                    // assign User to transaction
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactions(Long userId) {
        User user = userService.getUserById(userId); // fetch User first
        return transactionRepository.findByUser(user); // then pass User
    }
}
