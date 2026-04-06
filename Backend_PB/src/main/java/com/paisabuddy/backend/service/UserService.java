package com.paisabuddy.backend.service;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Save user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Get by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ FIX: Missing method (caused compilation error)
    public User updateIncome(Long userId, Double income) {
        User user = getUserById(userId);
        user.setMonthlyIncome(income);
        return userRepository.save(user);
    }
}