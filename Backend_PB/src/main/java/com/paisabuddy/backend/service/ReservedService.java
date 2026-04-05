package com.paisabuddy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.ReservedRepository;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class ReservedService {

    private final ReservedRepository reservedRepo;
    private final TransactionRepository transactionRepo;
    private final UserService userService;

    public ReservedService(ReservedRepository reservedRepo,
            TransactionRepository transactionRepo,
            UserService userService) {
        this.reservedRepo = reservedRepo;
        this.transactionRepo = transactionRepo;
        this.userService = userService;
    }

    // Add Reserved
    public Reserved addReserved(Reserved reserved) {
        reserved.setStatus(Reserved.Status.PENDING);
        return reservedRepo.save(reserved);
    }

    // Get Reserved
    public List<Reserved> getReserved(Long userId) {
        return reservedRepo.findByUserId(userId);
    }

    // Mark as Paid + Create Transaction
    public void markAsPaid(Long id) {
        Reserved r = reservedRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserved entry not found"));

        r.setStatus(Reserved.Status.PAID);
        reservedRepo.save(r);

        User user = userService.getUserById(r.getUserId());  // fetch User from reserved's userId
        Transaction t = new Transaction();
        t.setUser(user);  // assign User object
        t.setAmount(r.getAmount());
        t.setCategory(r.getTitle());
        t.setDescription("Reserved payment: " + r.getTitle());

        transactionRepo.save(t);
    }

    // Delete
    public void deleteReserved(Long id) {
        reservedRepo.deleteById(id);
    }
}
