package com.paisabuddy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paisabuddy.backend.model.Goal;
import com.paisabuddy.backend.model.GoalContribution;

@Repository
public interface GoalContributionRepository extends JpaRepository<GoalContribution, Long> {
    List<GoalContribution> findByGoal(Goal goal);
}