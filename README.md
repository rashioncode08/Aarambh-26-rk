# 🚀 AARAMBH '26 | Event Registration Portal

> The official ultra-premium, high-performance, neobrutalist convergence portal for the Aarambh '26 pop-art festival and first-year induction at **JK Lakshmipat University**.

---

## 🧠 Architectural Overview

Aarambh '26 is engineered as a secure, blazing-fast, and highly scalable serverless event portal utilizing a decoupled Next.js + Firestore layout.

```
┌─────────────────────────────────┐      HTTPS      ┌─────────────────────────────┐
│       Next.js 14 Frontend       │ ──────────────> │ Next.js API Route Handlers  │
│ (React + Tailwind v4 + Framer)  │ <────────────── │   (PG Validation, Emails)   │
└─────────────────────────────────┘                 └─────────────────────────────┘
                 │                                                 │
        Realtime Read/Write                               Secure PG Token Init
                 ▼                                                 ▼
┌─────────────────────────────────┐                 ┌─────────────────────────────┐
│       Cloud Firestore DB        │                 │   Cashfree Payment Gateway  │
│    (Registrations, Audit)       │                 │     (Convenience Fee 2%)    │
└─────────────────────────────────┘                 └─────────────────────────────┘
```

* **Frontend**: **Next.js 14 (App Router)** leveraging React functional hooks, **Tailwind CSS v4 (CSS-first engine)**, and **Framer Motion** for premium neobrutalist transitions and layouts.
* **Backend & API Gateway**: Secure Next.js API serverless route handlers managing transaction handshakes, brevo mail triggers, PDF ticket synthesis via `pdf-lib`, and audit log capturing.
* **Database**: **Cloud Firestore** for real-time validation tracking, duty assignments, and participant check-in auditing.
* **Integrations**:
  * **Cashfree PG**: Standard SDK validation with customized convenience transaction fee notes.
  * **Brevo (SMTP)**: Robust validation mailer sending digital PDF receipts dynamically to registrants.
  * **Power Automate**: Automated backend integration flows triggering on transaction resolution.

---

## 🧱 Key Features

* 💳 **Deterministic PG Integration**: Strictly mapped to a base price of **₹2,500** + convenience transaction fees.
* 🎫 **PDF Ticket Generator**: Compiles custom ticket layouts dynamically on confirmation with QR check-in assets.
* 🛡️ **Offline-Ready Scanner**: Complete volunteer/scanner check-in interface with camera QR reader hooks, device caching, and real-time validation feedback.
* 📊 **Admin Dashboard**: Real-time stats panels, announcer boards, dynamic schedule controllers, and CSV registration exports.
* 🎨 **Bespoke Typographic System**: Built using custom local **"Vanilla Extract"** brand fonts and modern geometric **"Outfit"** layouts.
* 📦 **SEO & PWA Configured**: Progressive Web App capabilities with optimized manifest dictionaries and semantic structure mappings.

---

## 🔧 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your developer machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)

---

### ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/aarambh-26.git
   cd aarambh-26
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment configuration into a local file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and populate it with your active **Firebase API keys**, **Cashfree Merchant credentials**, and **Brevo SMTP parameters**.

4. **Spin Up the Local Development Server**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000) to view your portal.

5. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

---

## 🎨 Typography & Fonts

This project leverages local font caching to maintain consistent rendering and load-speed optimization. All custom typefaces are statically hosted offline inside:
`public/fonts/`

* **`font-display` / `font-premium`**: Mapped to **Outfit** (Geometric Sans, weights 100-900).
* **`font-vanilla`**: Custom local brand display face **Vanilla Extract** (loaded natively via offline `@font-face`).
* **`font-sans`**: Mapped to **Google Sans** / **Roboto**.

---

## 🔐 Security & Commit Guidelines

* **Environment Secrets**: Never commit `.env.local` or raw configuration keys. `.gitignore` is pre-configured to strictly exclude all credentials, JSON secret keys, and database dump CSVs.
* **TypeScript Rules**: Always verify clean compilation states before proposing pull requests:
  ```bash
  npx tsc --noEmit
  ```
