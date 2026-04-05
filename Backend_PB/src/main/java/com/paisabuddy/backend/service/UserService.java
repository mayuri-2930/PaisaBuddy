package com.paisabuddy.backend.service;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.UserRepository;

@Autowired
private BCryptPasswordEncoder passwordEncoder;

// On registration
user.setPassword(passwordEncoder.encode(user.getPassword()));

// On login
if (!passwordEncoder.matches(password, user.getPassword())) {
    throw new RuntimeException("Invalid credentials");
}
@Service
public class UserService {

    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // Fetch user by ID
    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Fetch user by email
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Save User
    public User saveUser(User user) {
        return userRepo.save(user);
    }

    // Update income
    public User updateIncome(Long id, Double income) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setMonthlyIncome(income);
        return userRepo.save(user);
    }
}
