package com.paisabuddy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paisabuddy.backend.model.Reserved;

public interface ReservedRepository extends JpaRepository<Reserved, Long> {
    List<Reserved> findByUserId(Long userId);
}