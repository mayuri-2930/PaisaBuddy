package com.paisabuddy.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.service.ReservedService;
import com.paisabuddy.backend.service.UserService;

@RestController
@RequestMapping("/api/reserved")
public class ReservedController {

    private final ReservedService service;
    private final UserService userService;

    public ReservedController(ReservedService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    // Add Reserved
    @PostMapping
    public ResponseEntity<Reserved> add(@RequestBody Reserved reserved) {

        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        Reserved saved = service.addReserved(user.getId(), reserved);
        return ResponseEntity.ok(saved);
    }

    // Get Reserved
    @GetMapping
    public ResponseEntity<List<Reserved>> getAll() {

        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();

        List<Reserved> list = service.getReserved(user.getId());
        return ResponseEntity.ok(list);
    }

    // Mark as Paid
    @PutMapping("/{id}/pay")
    public ResponseEntity<Reserved> pay(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsPaid(id));
    }

    // Delete Reserved
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserved(@PathVariable Long id) {
        service.deleteReserved(id);
        return ResponseEntity.ok().build();
    }

    // =========================
    // AUTH FIX (NO LOGIC CHANGE)
    // =========================
    private User getAuthenticatedUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) return null;

        String email = auth.getName();

        return userService.getUserByEmail(email);
    }
}