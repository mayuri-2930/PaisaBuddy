package com.paisabuddy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    /** All transactions for a user in a given month/year. */
    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user = :user
          AND FUNCTION('YEAR',  t.date) = :year
          AND FUNCTION('MONTH', t.date) = :month
    """)
    List<Transaction> findByUserAndMonth(
            @Param("user")  User user,
            @Param("year")  int year,
            @Param("month") int month);

    /** DEBIT-only transactions for a user in a given month/year (actual spending). */
    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user = :user
          AND t.type = 'DEBIT'
          AND FUNCTION('YEAR',  t.date) = :year
          AND FUNCTION('MONTH', t.date) = :month
    """)
    List<Transaction> findDebitsByUserAndMonth(
            @Param("user")  User user,
            @Param("year")  int year,
            @Param("month") int month);

    /** CREDIT-only transactions for a user in a given month/year. */
    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user = :user
          AND t.type = 'CREDIT'
          AND FUNCTION('YEAR',  t.date) = :year
          AND FUNCTION('MONTH', t.date) = :month
    """)
    List<Transaction> findCreditsByUserAndMonth(
            @Param("user")  User user,
            @Param("year")  int year,
            @Param("month") int month);
}