package com.paisabuddy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.User;

@Repository
public interface ReservedRepository extends JpaRepository<Reserved, Long> {
    List<Reserved> findByUser(User user);
}