# Nexus Admin — E-Commerce SaaS Dashboard

A modern, production-grade admin dashboard built with **Vue 3**, **Pinia**, **Vue Router**, **Tailwind CSS**, and **Chart.js**. Features a complete authentication system, real-time-style data, CRUD operations, charts, dark mode, role-based access, and responsive design.

---

## ✨ Features

### Core
- 🔐 **Authentication** — Login/logout with token persistence (`localStorage`), mock user accounts, role detection
- 📊 **Dashboard** — KPI stat cards, revenue/orders/users line chart, order status doughnut chart, top products, recent orders
- 📦 **Product Management** — Full CRUD (create, read, update, delete), search, category/status filtering, pagination
- 🛒 **Order Management** — List all orders, inline status updates, search by ID or customer, pagination
- 👥 **Users** — Admin-only user list with role/status display
- ⚙️ **Settings** — Dark mode toggle, sidebar toggle, profile overview

### UX/Design
- 🌙 **Dark mode** — Persistent toggle via `localStorage`, system-aware
- 📱 **Responsive** — Mobile sidebar overlay, responsive tables, touch-friendly
- 🔔 **Toast notifications** — Animated success/error/warning toasts
- ⏳ **Loading states** — Skeleton loaders on every data-fetching page
- 🔄 **Smooth transitions** — Page transitions, modal animations, sidebar animation
- 🎨 **Design system** — Custom Tailwind config with consistent color palette, typography (`Sora` + `JetBrains Mono`), utility classes

### Technical
- 🗂️ **Pinia stores** — `auth` (user/token), `ui` (dark mode/sidebar/notifications)
- 🧭 **Vue Router 4** — Hash-history routing, navigation guards (auth + role checks), lazy-loaded views
- 🌐 **Service layer** — `src/services/api.js` wraps mock data; swap for real Axios calls with zero friction
- 🧩 **Component architecture** — Layout, common (Modal, Badge, Pagination, Notifications), Charts, Views
- 🔒 **Role-based access** — Admin vs User; `/users` route is admin-gated at the router level and hidden from nav for regular users

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.x ([download](https://nodejs.org))
- **npm** ≥ 9.x (bundled with Node)

### 1 — Install dependencies

```bash
cd nexus-admin
npm install
```

### 2 — Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3 — Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview it with:

```bash
npm run preview
```

---

## 🔑 Demo Accounts

The app ships with mock authentication. Use these on the login screen (any password ≥ 4 characters works, e.g. `demo123`):

| Name         | Email                  | Role  | Access            |
|--------------|------------------------|-------|-------------------|
| Aria Chen    | `aria@nexus.io`        | Admin | All pages + Users |
| Marcus Webb  | `marcus@example.com`   | User  | Dashboard, Products, Orders, Settings |

The login page shows clickable demo account cards to auto-fill credentials.

---

## 📁 Project Structure

```
nexus-admin/
├── index.html                    # Entry HTML (loads Google Fonts)
├── vite.config.js                # Vite + Vue plugin, @ alias
├── tailwind.config.js            # Design tokens, dark mode, custom colors/animations
├── postcss.config.js
├── package.json
│
└── src/
    ├── main.js                   # App bootstrap: Vue + Pinia + Router
    ├── App.vue                   # Root: RouterView + NotificationStack + dark init
    │
    ├── assets/
    │   └── main.css              # Tailwind directives + global component classes
    │
    ├── router/
    │   └── index.js              # Routes, lazy imports, auth/role guards
    │
    ├── stores/
    │   ├── auth.js               # Pinia: user, token, login(), logout(), fetchMe()
    │   └── ui.js                 # Pinia: darkMode, sidebar, notify(), dismiss()
    │
    ├── services/
    │   ├── api.js                # Service façade (authService, dashboardService, etc.)
    │   └── mockData.js           # In-memory mock API with realistic seed data + delay
    │
    ├── components/
    │   ├── layout/
    │   │   └── AppLayout.vue     # Shell: sidebar, topbar, RouterView with transitions
    │   ├── charts/
    │   │   ├── RevenueChart.vue  # Line chart (Revenue / Orders / Users tabs)
    │   │   └── OrderStatusChart.vue  # Doughnut chart with custom legend
    │   └── common/
    │       ├── StatCard.vue      # KPI card with trend badge
    │       ├── StatusBadge.vue   # Color-coded status pill
    │       ├── PaginationBar.vue # Smart paginator with ellipsis
    │       ├── AppModal.vue      # Teleported modal with backdrop
    │       └── NotificationStack.vue  # Teleported toast stack
    │
    └── views/
        ├── auth/
        │   └── LoginView.vue     # Login form + demo account cards
        ├── dashboard/
        │   └── DashboardView.vue # Main dashboard with charts + tables
        ├── products/
        │   └── ProductsView.vue  # Products CRUD with modal forms
        ├── orders/
        │   └── OrdersView.vue    # Orders list with inline status update
        ├── UsersView.vue         # Admin-only user management
        └── SettingsView.vue      # Dark mode, sidebar, profile, logout
```

---

## 🔧 Connecting a Real API

The entire API surface lives in `src/services/api.js`. Each service method is a thin wrapper — replace mock calls with real Axios calls:

```js
// src/services/api.js — example swap
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://your-api.com/api',
})

// Attach token to every request
http.interceptors.request.use(config => {
  const token = localStorage.getItem('nexus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const productService = {
  async list(params) {
    const { data } = await http.get('/products', { params })
    return data // must return { items, total, page, perPage, totalPages }
  },
  async create(payload) {
    const { data } = await http.post('/products', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await http.put(`/products/${id}`, payload)
    return data
  },
  async delete(id) {
    await http.delete(`/products/${id}`)
    return { success: true }
  },
}
```

Set your API base URL in a `.env` file:

```env
VITE_API_URL=https://your-backend.com/api
```

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Vue 3 (Composition API + `<script setup>`) |
| State       | Pinia 2                             |
| Routing     | Vue Router 4 (hash history)         |
| Styling     | Tailwind CSS 3 (JIT)                |
| Charts      | Chart.js 4 + vue-chartjs 5          |
| HTTP        | Axios (wired, mock data by default) |
| Icons       | Lucide Vue Next                     |
| Utilities   | @vueuse/core                        |
| Build       | Vite 5                              |
| Fonts       | Sora + JetBrains Mono (Google Fonts)|

---

## 📋 Available Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Start dev server (HMR)         |
| `npm run build`  | Production build → `dist/`     |
| `npm run preview`| Preview production build       |

---

## 🎨 Design Decisions

- **Color system**: Custom `primary` (blue), `accent` (purple), `surface` (slate) palettes defined in `tailwind.config.js`. All component classes reference these tokens.
- **Typography**: `Sora` for UI copy (clean, modern, not overused), `JetBrains Mono` for IDs/prices/numbers.
- **Dark mode**: Class-based (`darkMode: 'class'`), toggled on `<html>`, persisted to `localStorage`.
- **Hash routing**: Uses `createWebHashHistory()` so the app works without a server-side catch-all rule — just open `dist/index.html` directly.
- **No external UI library**: Every component is hand-crafted with Tailwind for full design control and minimal bundle size.

---

## 🐛 Common Issues

**Blank screen / 404 on refresh**
→ Using hash history (`#/`), so this shouldn't happen. If deploying to a subdirectory, set `base` in `vite.config.js`.

**`npm install` fails**
→ Ensure Node ≥ 18. Try `npm install --legacy-peer-deps` if you get peer dep conflicts.

**Charts not rendering**
→ Chart.js components require the container to have a defined height. All chart wrappers use `class="h-56"` or similar — don't remove those.

**Fonts not loading**
→ Requires internet access. For offline use, download Sora/JetBrains Mono and update `index.html` to use local font files.

---

