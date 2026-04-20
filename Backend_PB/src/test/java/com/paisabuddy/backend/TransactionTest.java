// package com.paisabuddy.backend;

// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertTrue;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;

// import com.paisabuddy.backend.model.Transaction;
// import com.paisabuddy.backend.model.User;
// import com.paisabuddy.backend.service.AuthService;
// import com.paisabuddy.backend.service.TransactionService;
// import com.paisabuddy.backend.service.UserService;

// @SpringBootTest
// class TransactionTests {

//     @Autowired
//     private JwtService jwtService;

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private AuthService authService;

//     private User testUser;
//     private String jwtToken;

//     @BeforeEach
//     void setupUser() {
//         // Create test user
//         User user = new User();
//         user.setName("Test User");
//         user.setEmail("test@example.com");
//         user.setPassword("password");
//         user.setMonthlyIncome(5000.0);

//         testUser = userService.saveUser(user);

//         // Generate JWT
//         jwtToken = jwtService.generateToken(user.getEmail());

//         // Optional: still mock SecurityContext for direct service calls
//         UsernamePasswordAuthenticationToken auth
//                 = new UsernamePasswordAuthenticationToken(testUser, null, null);
//         SecurityContextHolder.getContext().setAuthentication(auth);
//     }

//     @Test
//     void testAddAndRetrieve() {
//         Transaction t = new Transaction();
//         t.setAmount(100.0);
//         t.setCategory("Food");
//         t.setDescription("Test transaction");

//         Transaction savedTransaction = transactionService.addTransaction(testUser.getId(), t);
//         assertNotNull(savedTransaction.getId());

//         var list = transactionService.getTransactions(testUser.getId());
//         assertTrue(list.size() > 0);
//     }
// }
