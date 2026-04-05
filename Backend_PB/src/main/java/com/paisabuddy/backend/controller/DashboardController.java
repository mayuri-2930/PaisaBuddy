package com.paisabuddy.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.model.DashboardResponse;
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

    @GetMapping("/{userId}")
    public DashboardResponse getDashboard(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return service.getDashboard(userId);
    }
}
