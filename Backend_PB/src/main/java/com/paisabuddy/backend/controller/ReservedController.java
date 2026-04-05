package com.paisabuddy.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.service.ReservedService;

@RestController
@RequestMapping("/api/reserved")
public class ReservedController {

    private final ReservedService service;

    public ReservedController(ReservedService service) {
        this.service = service;
    }

    // @Autowired
    // private ReservedService service;
    
    @PostMapping
    public Reserved add(@RequestBody Reserved reserved) {
        return service.addReserved(reserved);
    }

    
    @GetMapping("/{userId}")
    public List<Reserved> getAll(@PathVariable Long userId) {
        return service.getReserved(userId);
    }

    @PutMapping("/{id}/pay")
    public void pay(@PathVariable Long id) {
        service.markAsPaid(id);
    }

    @DeleteMapping("/{id}")
    public void deleteReserved(@PathVariable Long id) {
        service.deleteReserved(id);
    }
}