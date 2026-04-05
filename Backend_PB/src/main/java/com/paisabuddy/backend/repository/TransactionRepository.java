package com.paisabuddy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Just declare the method signature
    List<Transaction> findByUser(User user);

}
