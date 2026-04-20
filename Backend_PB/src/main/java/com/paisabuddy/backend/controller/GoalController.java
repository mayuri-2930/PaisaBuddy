package com.paisabuddy.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.dto.GoalContributionRequest;
import com.paisabuddy.backend.dto.GoalResponse;
import com.paisabuddy.backend.model.Goal;
import com.paisabuddy.backend.service.GoalService;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    // CREATE GOAL
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@RequestBody Goal goal) {
        Goal savedGoal = goalService.createGoal(goal);
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.toGoalResponse(savedGoal));
    }

    // GET ALL GOALS
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals() {
        return ResponseEntity.ok(goalService.getGoalSummaries());
    }

    @PostMapping("/{goalId}/contribute")
    public ResponseEntity<GoalResponse> contributeToGoal(@PathVariable Long goalId,
                                                         @RequestBody GoalContributionRequest request) {
        return ResponseEntity.ok(goalService.contributeAndSummarize(goalId, request.getAmount()));
    }
}
