package com.paisabuddy.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        // Correct usage: call getUserById once
        return service.getUserById(id);
    }

    @PutMapping("/{id}/income")
    public User updateIncome(@PathVariable Long id, @RequestBody Double income) {
        return service.updateIncome(id, income);
    }
}