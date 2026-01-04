# Phase 10 – Production Hardening Plan (SecondChance Marketplace)

Dokumen ini merangkumi perancangan teknikal terperinci untuk menaikkan SecondChance Marketplace daripada **Phase 9 (feature-complete)** kepada **Phase 10 (production-grade, scalable, dan monetizable)**.

---

## 🎯 Objektif Phase 10

Menjadikan marketplace:
- Stabil di production
- Mudah diskalakan
- Audit & dispute ready
- Payment-ready (walaupun mock)
- Mudah diterangkan dalam interview / pitching

Fokus **BUKAN UI**, tetapi **system behaviour & architecture**.

---

## 1️⃣ Order State Machine (WAJIB)

### Masalah Semasa
- Order flow terlalu linear
- Tiada sokongan untuk dispute, refund, atau cancellation berlapik

### State Cadangan (Final)
```
Draft
→ Requested
→ Accepted
→ Rejected
→ Cancelled (Buyer)
→ Cancelled (Seller)
→ Shipped
→ Delivered
→ Completed
→ Disputed
→ Refunded
```

### Peraturan Kritikal
- Setiap transition **role-based** (Buyer / Seller / Admin)
- Transition invalid → HTTP 403 / 422
- Transition mesti direkodkan dalam audit log

### Implementasi
- Enum / Constant untuk `order_status`
- `OrderStateService`
- Centralized validation (BUKAN di controller)

---

## 2️⃣ Payment Architecture (Mock tapi Production-Ready)

### Prinsip
- Order ≠ Payment
- Payment adalah async
- System mesti tahan inconsistency

### Table Cadangan
**payments**
- id
- order_id
- amount
- status (pending, paid, failed, refunded)
- provider (mock, stripe, etc)
- created_at

**payment_intents**
- id
- order_id
- amount
- expires_at
- status

**refunds**
- id
- payment_id
- amount
- reason
- status

### Flow Ringkas
```
Order Created
→ Payment Intent Created
→ Payment Confirmed (Mock)
→ Order Status Updated
```

---

## 3️⃣ Vendor Isolation (Security Hardening)

### Masalah Biasa (ANTI-PATTERN)
- Filter `seller_id` dalam controller sahaja

### Solution Betul
- Laravel Policy
- Scoped Query (`->whereSellerId(auth()->id())`)
- Service-level enforcement

### Outcome
- Seller A mustahil nampak data Seller B
- Security enforce di **multiple layer**

---

## 4️⃣ Audit Log System

### Kenapa Penting
- Dispute
- Refund
- Compliance
- Debug production issue

### Table Cadangan
**activity_logs**
- id
- actor_id
- actor_role
- entity_type (Order, Item, Payment)
- entity_id
- action
- old_value
- new_value
- created_at

### Contoh Rekod
```
Order #123
Requested → Accepted
By: Seller (ID 45)
At: 2026-01-03 14:32
```

---

## 5️⃣ API Standardization

### Versioning
- Semua endpoint di bawah `/api/v1`

### Response Standard
```json
{
  "success": true,
  "data": {},
  "message": "Action completed"
}
```

### Error Handling
- 401 → Unauthorized
- 403 → Forbidden
- 422 → Validation
- 500 → Server error (logged)

---

## 6️⃣ Interview & Monetization Readiness

### Soalan Yang Boleh Dijawab Lepas Phase 10
- How do you handle order disputes?
- How do you design async payment flow?
- How do you prevent data leakage between sellers?
- How do you audit user actions?

### Monetization Layer (Future)
- Commission per transaction
- Featured listing
- Subscription seller tier

---

## ✅ Definition of Done (Phase 10)

Marketplace dianggap **production-ready** bila:
- Semua order transition tervalidasi
- Payment architecture wujud (mock diterima)
- Semua critical action diaudit
- Vendor isolation enforce di policy + service
- API versioned & consistent

---

**Nota Akhir**
> Phase 10 bukan pasal tambah feature baru.
> Phase 10 ialah pasal buat sistem kau **boleh dipercayai dalam dunia sebenar**.

