// package com.paisabuddy.backend.service;

// import java.util.Date;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;

// import com.paisabuddy.backend.model.User;
// import com.paisabuddy.backend.repository.UserRepository;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;

// @Service
// public class AuthService {

//     private final String jwtSecret = "secret-key";
//     private final long jwtExpirationMs = 24 * 60 * 60 * 1000;

//     private final UserService userService;
//     private final UserRepository userRepository;
//     private final BCryptPasswordEncoder passwordEncoder;

//     // ✅ FIXED constructor
//     public AuthService(UserService userService,
//                        UserRepository userRepository,
//                        BCryptPasswordEncoder passwordEncoder) {
//         this.userService = userService;
//         this.userRepository = userRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     // ✅ REGISTER
//     public User register(User user) {

//         if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
//             throw new RuntimeException("Password cannot be empty");
//         }

//         if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
//             throw new RuntimeException("Email cannot be empty");
//         }

//         String email = user.getEmail().trim().toLowerCase();

//         // ✅ FIX: duplicate email check
//         if (userRepository.existsByEmail(email)) {
//             throw new RuntimeException("Email already exists");
//         }

//         user.setEmail(email);

//         String encodedPassword = passwordEncoder.encode(user.getPassword().trim());
//         user.setPassword(encodedPassword);

//         return userService.saveUser(user);
//     }

//     // ✅ LOGIN
//     public String login(String email, String password) {

//         String normalizedEmail = email.trim().toLowerCase();
//         String rawPassword = password.trim();

//         User user = userService.getUserByEmail(normalizedEmail);

//         if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
//             throw new RuntimeException("Invalid credentials");
//         }

//         return generateToken(user);
//     }

//     // ✅ JWT TOKEN (email as subject)
//     public String generateToken(User user) {
//         return Jwts.builder()
//                 .setSubject(user.getEmail()) // 🔴 IMPORTANT
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
//                 .signWith(SignatureAlgorithm.HS256, jwtSecret)
//                 .compact();
//     }
// }

package com.paisabuddy.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.UserRepository;
import com.paisabuddy.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(user.getEmail());
    }
}