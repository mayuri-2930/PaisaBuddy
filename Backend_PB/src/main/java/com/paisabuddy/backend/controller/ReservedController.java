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

@RestController
@RequestMapping("/api/reserved")
public class ReservedController {

    private final ReservedService service;

    public ReservedController(ReservedService service) {
        this.service = service;
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
    public ResponseEntity<Void> pay(@PathVariable Long id) {
        service.markAsPaid(id);
        return ResponseEntity.ok().build();
    }

    // Delete Reserved
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserved(@PathVariable Long id) {
        service.deleteReserved(id);
        return ResponseEntity.ok().build();
    }

    // Helper to get authenticated user
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) return null;
        return (User) auth.getPrincipal();
    }
}