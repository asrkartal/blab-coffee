# Blab Coffee

A modern, responsive web application for a school coffee shop. Built with vanilla JavaScript and Supabase for backend services including authentication and database management.

## Features

### Customer Features
- **Shopping Cart** — Add, remove, and manage items with real-time updates
- **User Authentication** — Secure sign-up, login, and password reset via Supabase Auth
- **Order Tracking** — View order history and status updates
- **Loyalty Program** — Earn stamps with each coffee purchase (9 stamps = 1 free coffee)
- **Theme Support** — Toggle between dark and light modes
- **Internationalization** — Available in Turkish and English

### Admin Features
- **Dashboard** — View daily, weekly, and total revenue statistics
- **Order Management** — Update order status with one-click toggle
- **Analytics** — Visual chart displaying 7-day revenue trends
- **Customer Insights** — Track unique customer count

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Logic & Interactivity |
| Supabase | Authentication & PostgreSQL Database |

## Getting Started

1. Clone the repository
2. Create a Supabase project at [supabase.com](https://supabase.com)
3. Update `supabase.js` with your project URL and anon key
4. Create an `orders` table in Supabase with the required schema
5. Configure Row Level Security policies
6. Deploy or open `index.html` locally

## Live Demo

🔗 [https://asrkartal.github.io/blab-coffee](https://asrkartal.github.io/blab-coffee)

## License

MIT License

---

Developed by [@asrkartal](https://github.com/asrkartal)
