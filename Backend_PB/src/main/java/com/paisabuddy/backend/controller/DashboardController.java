package com.paisabuddy.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.dto.DashboardResponse;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.service.DashboardService;
import com.paisabuddy.backend.service.UserService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;
    private final UserService userService;

    public DashboardController(DashboardService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.getUserByEmail(auth.getName());

        DashboardResponse response = service.getDashboard(user);
        return ResponseEntity.ok(response);
    }
}
