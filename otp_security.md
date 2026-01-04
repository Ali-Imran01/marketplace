# OTP Security & Verification Flow (Production-Grade)

## Objective
This document defines a **secure, production-ready OTP implementation** for user registration and email verification in a public marketplace system.

---

## 1. Core Principles (Non-Negotiable)

- OTP is **never stored in plain text**
- OTP has **short expiry** (3–5 minutes)
- OTP has **attempt limits**
- Auth token is issued **only after OTP verification**
- Resend OTP is **rate-limited**

---

## 2. Registration Flow (Correct Design)

### Step-by-step
```
Register Form
→ Validate input
→ Create user (UNVERIFIED)
→ Generate OTP (hashed)
→ Store OTP + expiry + attempts
→ Send OTP
→ Wait for verification
```

### Key Rules
- User record **must exist immediately**
- `email_verified_at` remains NULL
- No auth token is issued yet

---

## 3. OTP Storage Strategy

### ❌ Do NOT do this
- Store OTP in plain text
- Reuse OTP
- Send OTP in API response

### ✅ Correct approach
- Hash OTP using `Hash::make()`
- Compare using `Hash::check()`

---

## 4. OTP Verification Logic

### Verification checks (in order)
1. OTP not expired
2. Attempts < max limit
3. OTP hash matches

### On success
- Set `email_verified_at`
- Clear OTP fields
- Reset attempt counter
- Issue auth token

---

## 5. Resend OTP Logic (IMPORTANT)

### ❗ Replacement Rule
When resending OTP:
- **REPLACE** the existing OTP
- **RESET** expiry time
- **RESET** attempt counter

### Correct Behavior
```
$resend → new OTP generated
→ old OTP becomes invalid
→ new expiry countdown starts
```

### Why replacement is mandatory
- Prevent parallel valid OTPs
- Prevent replay attacks
- Keep verification logic simple

---

## 6. Rate Limiting (Resend Protection)

### Minimum Requirements
- Cooldown: 60 seconds
- Max resend attempts per window

### Failure behavior
- Return HTTP 429
- Clear message: "Please wait before resending OTP"

---

## 7. Environment Handling

### Development
- OTP may be logged or displayed (DEV ONLY)
- Controlled via ENV flag

### Production
- OTP delivery via Email/SMS ONLY
- No debug OTP exposure

---

## 8. Cleanup Strategy

### Unverified accounts
- Auto-delete after 7–30 days
- Scheduled via cron / scheduler

---

## 9. Final Verdict

This design:
- Scales safely
- Prevents brute force
- Avoids data leaks
- Meets real-world marketplace security standards

Any deviation from this flow introduces **real security risk**.

