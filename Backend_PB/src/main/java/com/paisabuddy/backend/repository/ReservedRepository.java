package com.paisabuddy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.User;

@Repository
public interface ReservedRepository extends JpaRepository<Reserved, Long> {

    List<Reserved> findByUser(User user);

    /**
     * Returns all PENDING reserved entries for a user whose dueDate falls
     * within the given month/year. These are the ones deducted from spendable.
     */
    @Query("""
        SELECT r FROM Reserved r
        WHERE r.user = :user
          AND r.status = 'PENDING'
          AND FUNCTION('YEAR',  r.dueDate) = :year
          AND FUNCTION('MONTH', r.dueDate) = :month
    """)
    List<Reserved> findCurrentMonthPending(
            @Param("user")  User user,
            @Param("year")  int year,
            @Param("month") int month);

    /** Find all instances that belong to a given parent (recurring group). */
    List<Reserved> findByParentId(Long parentId);
}