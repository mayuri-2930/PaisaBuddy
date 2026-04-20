// package com.paisabuddy.backend.security;
// import java.io.IOException;
// import java.util.Collections;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;
// import com.paisabuddy.backend.model.User;
// import com.paisabuddy.backend.repository.UserRepository;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// @Component
// public class JwtAuthenticationFilter extends OncePerRequestFilter {
//     private final JwtService jwtService;
//     private final UserRepository userRepository;
//     public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
//         this.jwtService = jwtService;
//         this.userRepository = userRepository;
//     }
//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain filterChain)
//             throws ServletException, IOException {
//         System.out.println("FILTER HIT: " + request.getRequestURI());
//         String header = request.getHeader("Authorization");
//         if (header == null || !header.startsWith("Bearer ")) {
//             filterChain.doFilter(request, response);
//             return;
//         }
//         String token = header.substring(7);
//         try {
//             String email = jwtService.extractEmail(token);
//             if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                 User user = userRepository.findByEmail(email).orElse(null);
//                 if (user != null) {
//                     // ✅ IMPORTANT: store EMAIL as principal (stable across controllers)
//                     UsernamePasswordAuthenticationToken authToken =
//                             new UsernamePasswordAuthenticationToken(
//                                     email,
//                                     null,
//                                     Collections.emptyList()
//                             );
//                     authToken.setDetails(
//                             new WebAuthenticationDetailsSource().buildDetails(request)
//                     );
//                     SecurityContextHolder.getContext().setAuthentication(authToken);
//                     System.out.println("AUTH SET SUCCESS: " + email);
//                 }
//             }
//         } catch (Exception e) {
//             System.out.println("JWT ERROR: " + e.getMessage());
//         }
//         filterChain.doFilter(request, response);
//     }
// }
package com.paisabuddy.backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =========================
        // DEBUG: REQUEST CHECK
        // =========================
        String authHeader = request.getHeader("Authorization");

        System.out.println("========== JWT FILTER HIT ==========");
        System.out.println("REQUEST URI: " + request.getRequestURI());
        System.out.println("AUTH HEADER: " + authHeader);

        // If no token → continue chain (will later fail as 401 if protected)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("NO BEARER TOKEN FOUND");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);

            String email = jwtService.extractEmail(token);

            System.out.println("EMAIL FROM TOKEN: " + email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                User user = userRepository.findByEmail(email).orElse(null);

                System.out.println("USER FOUND: " + (user != null));

                if (user != null) {

                    UsernamePasswordAuthenticationToken authToken
                            = new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    java.util.List.of(() -> "ROLE_USER")
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("AUTH SET SUCCESS: " + email);
                }
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
