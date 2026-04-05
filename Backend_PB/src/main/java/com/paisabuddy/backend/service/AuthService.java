package com.paisabuddy.backend.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class AuthService {

    private final String jwtSecret = "secret-key"; // same as JwtAuthenticationFilter
    private final long jwtExpirationMs = 24 * 60 * 60 * 1000; // 24 hours

    private final UserService userService;

    public AuthService(UserService userService) {
        this.userService = userService;
    }

    // Register new user
    public User register(User user) {
        return userService.saveUser(user);
    }

    // Login and generate JWT
    public String login(String email, String password) {
        User user = userService.getUserByEmail(email);
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return generateToken(user);
    }

    // JWT generation
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
}