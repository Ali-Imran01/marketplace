# SecondChance – Project Planning

## 1. Project Overview
**SecondChance** ialah platform web untuk jual beli barangan terpakai yang fokus kepada **user-friendliness, trust, dan guided experience**. Projek ini dibangunkan sebagai **API-first application** menggunakan **Laravel (backend)** dan **React (frontend)**, dengan sokongan **multi-language (BM / English)** serta **mobile-first responsive design**.

---

## 2. Target & Scope

### Target User
- Public (general audience)
- Tidak terhad kepada niche tertentu

### Platform
- Web application
- Mobile-first, fully responsive

### Language
- Bahasa Melayu (BM)
- English (EN)
- Language boleh ditukar melalui user settings (client-side)

---

## 3. Core Principles (Design & Architecture)

1. **Mobile-First UX**
   - Semua flow direka untuk mobile terlebih dahulu
   - Desktop sebagai enhancement

2. **Minimal Cognitive Load**
   - 1 primary action setiap screen
   - Kurang teks dan field yang tidak perlu

3. **Guided Experience**
   - Wizard-based listing
   - Step-by-step flow, bukan long form

4. **Trust-Oriented Design**
   - Condition declaration wajib
   - Transaction status jelas
   - Seller visibility & rating

---

## 4. Key Differentiators (USP)

### 4.1 Guided Item Listing
- Step-by-step wizard:
  1. Pilih kategori
  2. Jawab soalan condition
  3. Upload gambar
  4. Cadangan harga (basic logic)
  5. Preview & publish

### 4.2 Condition-Based Trust System
- Condition enum:
  - NEW
  - LIKE_NEW
  - GOOD
  - FAIR
- Condition checklist ikut kategori

### 4.3 Controlled Buyer–Seller Interaction
- Tiada free chat terus
- Buyer hanya boleh:
  - Express interest
  - Offer price
  - Ask predefined questions
- Chat unlock selepas seller respond

### 4.4 Transaction State Machine
- Status flow tidak boleh dilangkau
- Audit trail kekal

---

## 5. Core Features (MVP)

### 5.1 User
- Register / Login (Laravel Sanctum)
- Profile management
- Seller rating
- Listing history
- Purchase history

### 5.2 Item / Listing
- Create, update, delete item
- Category
- Condition
- Price
- Images
- Status: AVAILABLE / RESERVED / SOLD

### 5.3 Transaction
- Buyer request / offer
- Seller accept / reject
- Status tracking
- Optional review selepas selesai

### 5.4 Admin (Basic)
- Manage users
- Manage categories
- View flagged items

---

## 6. Transaction State Flow

```
AVAILABLE
   ↓
REQUESTED
   ↓ (seller accept)
ACCEPTED
   ↓
ITEM_SENT
   ↓
RECEIVED
   ↓
COMPLETED
```

Rules:
- Tiada skipping state
- Transaction tidak boleh dipadam
- Semua perubahan direkod

---

## 7. Technology Stack

### Development Environment (Locked)

#### Backend
- PHP **8.2**
- Composer **2.4.1**
- Laravel **10** (API-first)

#### Frontend
- Node.js **22.17.1**
- React (Vite)
- React Router
- Axios
- Tailwind CSS / MUI
- react-i18next

#### Database
- MySQL **>= 8.0**

---


## 8. Multi-Language Strategy

### Backend
- Backend hanya return code / enum
- Tiada hardcoded text response

Contoh:
- condition: `LIKE_NEW`
- status: `AVAILABLE`

### Frontend
- Translation diuruskan sepenuhnya di React
- react-i18next
- Language preference disimpan dalam `localStorage`

---

## 9. Database Design (High-Level)

### users
- id
- name
- email
- password
- rating
- created_at

### items
- id
- user_id
- category_id
- title
- description
- condition
- price
- status
- created_at

### item_images
- id
- item_id
- path

### transactions
- id
- item_id
- buyer_id
- seller_id
- offered_price
- status
- created_at

### reviews
- id
- transaction_id
- rating
- comment

---

## 10. Backend Architecture (Laravel)

```
app/
 ├── Http/
 │   ├── Controllers/API
 │   ├── Requests
 │   └── Resources
 ├── Models
 ├── Services
 ├── Enums
 └── Policies
```

Principles:
- Controller nipis
- Business logic dalam Services
- Authorization guna Policies
- Enum untuk status & condition

---

## 11. Frontend Architecture (React)

```
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── hooks/
 ├── context/
 ├── i18n/
 └── utils/
```

Rules:
- Mobile-first components
- Reusable UI components
- Context hanya untuk Auth & Language

---

## 12. Development Phases

### Phase 1 – Foundation
- Project setup (Laravel & React)
- Auth & role handling
- Language switch
- Responsive base layout

### Phase 2 – Marketplace Core
- Item listing
- Browse & filter
- Item detail page

### Phase 3 – Transaction Flow
- Buyer request
- Seller response
- Status tracking

### Phase 4 – UX Polish
- Listing wizard
- Empty states
- Loading skeletons
- Error handling

---

## 13. Future Enhancements (Out of Scope MVP)
- Online payment (Stripe)
- Real-time chat (WebSocket)
- AI price suggestion
- Image verification
- Location-based search

---

## 14. Objective
Projek ini bertujuan untuk:
- Menunjukkan kemahiran full-stack (Laravel + React)
- Menunjukkan pemahaman UX & business logic
- Menjadi portfolio yang boleh diskalakan ke production-level system

