package com.paisabuddy.paisabuddy.repository;

import com.paisabuddy.paisabuddy.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}