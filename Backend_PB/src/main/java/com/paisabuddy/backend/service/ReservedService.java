package com.paisabuddy.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paisabuddy.backend.model.Reserved;
import com.paisabuddy.backend.model.Transaction;
import com.paisabuddy.backend.model.User;
import com.paisabuddy.backend.repository.ReservedRepository;
import com.paisabuddy.backend.repository.TransactionRepository;

@Service
public class ReservedService {

    private final ReservedRepository reservedRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public ReservedService(ReservedRepository reservedRepository,
                           TransactionRepository transactionRepository,
                           UserService userService) {
        this.reservedRepository = reservedRepository;
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    @Transactional
    public List<Reserved> addReserved(Long userId, Reserved reserved) {
        User user = userService.getUserById(userId);
        reserved.setUser(user);
        LocalDate today = LocalDate.now();

        if (reserved.getFrequency() == null ||
                reserved.getFrequency() == Reserved.Frequency.ONE_TIME) {
            reserved.setFrequency(Reserved.Frequency.ONE_TIME);
            if (reserved.getDueDate() == null) {
                reserved.setDueDate(reserved.getPaymentDate() != null ? reserved.getPaymentDate() : today);
            }
            reserved.setStatus(isCurrentMonth(reserved.getDueDate(), today)
                    ? Reserved.Status.PENDING : Reserved.Status.UPCOMING);
            return List.of(reservedRepository.save(reserved));
        }

        LocalDate start = reserved.getStartDate() != null ? reserved.getStartDate() : today;
        LocalDate end   = reserved.getEndDate() != null ? reserved.getEndDate()
                : today.withDayOfYear(today.lengthOfYear());
        int preferredDay = (reserved.getPaymentDate() != null)
                ? reserved.getPaymentDate().getDayOfMonth() : start.getDayOfMonth();

        List<LocalDate> dueDates = buildDueDates(reserved.getFrequency(), start, end, preferredDay);
        if (dueDates.isEmpty()) return List.of();

        Reserved parent = buildInstance(reserved, user, dueDates.get(0), today, null);
        parent = reservedRepository.save(parent);
        Long parentId = parent.getId();

        List<Reserved> allInstances = new ArrayList<>();
        allInstances.add(parent);
        for (int i = 1; i < dueDates.size(); i++) {
            allInstances.add(reservedRepository.save(buildInstance(reserved, user, dueDates.get(i), today, parentId)));
        }
        return allInstances;
    }

    public List<Reserved> getReserved(Long userId) {
        return reservedRepository.findByUser(userService.getUserById(userId));
    }

    public double getCurrentMonthReservedTotal(User user) {
        LocalDate today = LocalDate.now();
        return reservedRepository
                .findCurrentMonthPending(user, today.getYear(), today.getMonthValue())
                .stream().mapToDouble(Reserved::getAmount).sum();
    }

    @Transactional
    public Reserved markAsPaid(Long id) {
        Reserved r = reservedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserved not found: " + id));

        r.setStatus(Reserved.Status.PAID);
        r.setPaidDate(LocalDate.now());
        reservedRepository.save(r);

        // Create expense transaction using only fields Transaction actually has
        Transaction tx = new Transaction();
        tx.setAmount(r.getAmount());
        tx.setDescription("[Reserved] " + r.getTitle());
        tx.setCategory(deriveCategory(r.getTitle()));
        tx.setDate(r.getPaidDate());
        tx.setUser(r.getUser());
        transactionRepository.save(tx);

        return r;
    }

    @Transactional
    public void deleteReserved(Long id) {
        Reserved r = reservedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserved not found: " + id));
        List<Reserved> children = reservedRepository.findByParentId(id);
        if (!children.isEmpty()) reservedRepository.deleteAll(children);
        reservedRepository.delete(r);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private String deriveCategory(String title) {
        if (title == null) return "Other";
        String t = title.toLowerCase();
        if (t.contains("rent") || t.contains("house") || t.contains("flat")) return "Rent";
        if (t.contains("travel") || t.contains("pass") || t.contains("metro") || t.contains("bus")) return "Travel";
        if (t.contains("laundry") || t.contains("wash")) return "Laundry";
        if (t.contains("internet") || t.contains("broadband") || t.contains("wifi")) return "Internet";
        if (t.contains("grocery") || t.contains("groceries")) return "Groceries";
        if (t.contains("food") || t.contains("lunch") || t.contains("dinner") || t.contains("zomato") || t.contains("swiggy")) return "Food";
        if (t.contains("emi") || t.contains("loan") || t.contains("mortgage")) return "EMI";
        if (t.contains("electric") || t.contains("water") || t.contains("gas") || t.contains("bill")) return "Utilities";
        if (t.contains("phone") || t.contains("mobile") || t.contains("recharge")) return "Phone";
        if (t.contains("insurance")) return "Insurance";
        if (t.contains("chore") || t.contains("maid") || t.contains("clean")) return "Chores";
        return "Other";
    }

    private List<LocalDate> buildDueDates(Reserved.Frequency freq, LocalDate start, LocalDate end, int preferredDay) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate cursor = adjustDay(start, preferredDay);
        if (cursor.isBefore(start)) cursor = advanceByFrequency(cursor, freq);
        while (!cursor.isAfter(end)) { dates.add(cursor); cursor = advanceByFrequency(cursor, freq); }
        return dates;
    }

    private LocalDate advanceByFrequency(LocalDate date, Reserved.Frequency freq) {
        return switch (freq) {
            case MONTHLY -> date.plusMonths(1);
            case QUARTERLY -> date.plusMonths(3);
            case YEARLY -> date.plusYears(1);
            default -> date.plusYears(100);
        };
    }

    private LocalDate adjustDay(LocalDate base, int preferredDay) {
        return base.withDayOfMonth(Math.min(preferredDay, base.lengthOfMonth()));
    }

    private Reserved buildInstance(Reserved template, User user, LocalDate dueDate, LocalDate today, Long parentId) {
        Reserved r = new Reserved();
        r.setTitle(template.getTitle()); r.setAmount(template.getAmount());
        r.setFrequency(template.getFrequency()); r.setStartDate(template.getStartDate());
        r.setEndDate(template.getEndDate()); r.setPaymentDate(template.getPaymentDate());
        r.setDueDate(dueDate); r.setUser(user); r.setParentId(parentId);
        r.setStatus((isCurrentMonth(dueDate, today) || dueDate.isBefore(today))
                ? Reserved.Status.PENDING : Reserved.Status.UPCOMING);
        return r;
    }

    private boolean isCurrentMonth(LocalDate date, LocalDate today) {
        return date.getYear() == today.getYear() && date.getMonthValue() == today.getMonthValue();
    }
}