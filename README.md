# 6COSC022W Coursework 2 (2023/24) - Description

Design of web application and essay

TravelTales – A Global Journey Through Stories

**TravelTales** is a full-stack travel blog platform where users can share personal travel experiences, enriched with real-time country data. Built with **Next.js App Router**, **SQLite**, and modern best practices, TravelTales offers a smooth, secure, and community-driven space for explorers to connect.

## 🌍 Overview

TravelTales brings together storytelling and geography. Each blog post is automatically enhanced with authentic country information including:

- Country flag
- Capital city
- Currency
- Languages

Users can interact with posts, follow others, comment, and manage their own travel blog content. The platform balances usability, performance, and security in a cohesive design.

---

## ✨ Features

### Public Features

- Browse all blog posts
- View posts enriched with real-time country data
- Like/dislike and comment on posts

### Authenticated Features

- Register/login with secure password hashing
- Create, edit, and delete blog posts
- Follow and unfollow other users
- View followers/following lists
- See followed users’ posts on your personalized feed

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Node.js (API routes in Next.js)
- **Database**: SQLite with `better-sqlite3`
- **Authentication**: Custom auth with bcrypt hashing
- **Country Data API**: [RestCountries.com](https://restcountries.com)
- **Deployment**: Local/Manual deployment-ready

---

## 🔐 Security Highlights

- Passwords are hashed with **bcrypt** before storage
- API routes check for proper authentication and authorization
- Users can only edit/delete their own content
- Follows, likes, and comments are validated against session identity

---

## 🧪 Testing & Performance

- Lightweight SQLite ensures fast, local development
- Routes are modular and easy to test individually
- Optimized API calls and frontend state handling for responsive UX

---

## 🚀 Getting Started

```bash
git clone https://github.com/ramzyzarook/travel-app.git
cd traveltales
npm install
npm run dev
Go to http://localhost:3000 to explore the application.

```
## Notes
All country-related data is fetched dynamically via the RestCountries API.

The application is designed for the course work and local use or further deployment via services like Vercel

## Author
Ramzy Zarook
20211241/w1898911
SE Student | UoW