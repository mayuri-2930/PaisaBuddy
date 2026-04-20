package com.paisabuddy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.ReservedRepository;

@Service
public class ReservedService {

    private final ReservedRepository reservedRepository;
    private final UserService userService;

    public ReservedService(ReservedRepository reservedRepository,
                           UserService userService) {
        this.reservedRepository = reservedRepository;
        this.userService = userService;
    }

    // CREATE
    public Reserved addReserved(Long userId, Reserved reserved) {

        User user = userService.getUserById(userId);

        reserved.setUser(user);
        reserved.setStatus(Reserved.Status.PENDING);

        return reservedRepository.save(reserved);
    }

    // GET ALL
    public List<Reserved> getReserved(Long userId) {

        User user = userService.getUserById(userId);

        return reservedRepository.findByUser(user);
    }

    // MARK AS PAID
    public Reserved markAsPaid(Long id) {

        Reserved r = reservedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserved not found"));

        r.setStatus(Reserved.Status.PAID);

        return reservedRepository.save(r);
    }

    // DELETE
    public void deleteReserved(Long id) {
        reservedRepository.deleteById(id);
    }
}