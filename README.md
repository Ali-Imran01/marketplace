# SecondChance – Recommerce Marketplace Platform

**SecondChance** is a sophisticated, premium web platform designed for buying and selling pre-owned items. It focuses on **user trust, minimal cognitive load, and a guided experience**, bridging the "fragmentation gap" in traditional marketplaces.

---

## 🚀 Vision & Purpose
SecondChance isn't just a list of items; it's a **curated transaction ecosystem**. The platform is built to demonstrate:
- **Full-stack Excellence**: Seamless integration between a robust Laravel API and a dynamic React frontend.
- **Guided UX**: Reducing user friction with wizard-based flows and intelligent status management.
- **Trust Architecture**: Comprehensive condition declarations and a strict transaction state machine.

---

## ✨ Key Features

### 🛠️ Guided Item Listing (Wizard)
- **Step-by-Step Flow**: Instead of long, overwhelming forms, sellers are guided through category selection, condition checklists, and photo uploads.
- **Condition-Based Trust**: Mandatory condition declarations (NEW, LIKE_NEW, GOOD, FAIR) with category-specific criteria.

### 🔄 Transaction State Machine
- **Strict Flow**: Transactions follow an immutable path: `AVAILABLE` ➔ `REQUESTED` ➔ `ACCEPTED` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `COMPLETED`.
- **Anti-Double Sale**: Items are automatically locked (Reserved) during active negotiations.
- **Smart Cancellation**: Automated inventory reversal when orders are cancelled.

### 💬 Interaction Engine
- **Predefined Inquiries**: Control initial interactions to reduce spam.
- **Real-Time Messaging**: Polling-based chat once initial interest is accepted.
- **Notification System**: Real-time alerts for messages and order updates.

### 📊 Advanced Dashboard
- **Role-Based Views**: Distinct interfaces for Buyers and Sellers.
- **Visual Timelines**: Progress trackers for every order.
- **Admin Control Center**: Full visibility over users and listings to maintain community standards.

---

## 🛠️ Technology Stack

### Backend (The Brain)
- **Framework**: Laravel 10 (API-First Architecture)
- **Authentication**: Laravel Sanctum (Secure token-based auth)
- **Logic Layer**: Centralized `Services` and `Policies` for clean business logic.
- **Database**: MySQL (Relational schema with full audit logging).

### Frontend (The Soul)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & Material UI (MUI) for a premium, responsive aesthetic.
- **State Management**: React Context (Auth & Internationalization).
- **Multi-Language**: Full implementation of `react-i18next` (English & Bahasa Melayu).

---

## 🛡️ Security & Auditing
- **Ownership Policies**: Strict Laravel Policies ensure only owners can manage their listings.
- **Activity Logs**: Every major action is audited (price changes, status transitions, etc.).
- **Data Isolation**: Multi-tenant style isolation at the database level for user data privacy.

---

## 🏁 Development Status

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1-6** | Core Marketplace Logic & CRUD | ✅ Done |
| **Phase 7** | Production Readiness (Auth & Admin) | ✅ Done |
| **Phase 8** | Advanced UI, Real-time Alerts & Filters | ✅ Done |
| **Phase 9** | Dashboard Evolution & Order Management | ✅ Done |
| **Phase 10** | Production Hardening & Audit Logs | ✅ Done |

---

## ⚙️ Installation & Setup

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   composer install
   php artisan migrate --seed
   php artisan serve
   ```
3. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```
4. **Environment**: Configure `.env` with your database and Pusher credentials (if applicable).

---

*Developed with ❤️ by Ali-Imran01*
