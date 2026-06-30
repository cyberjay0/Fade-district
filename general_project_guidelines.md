# General Project Guidelines

This document outlines the standard rules, preferred technology stacks, and UI/UX requirements for all future web development projects.

## 1. Global UI/UX Requirements
*   **Preloader Screens:** EVERY project must be built with a custom, aesthetically pleasing preloader screen that masks the initial loading of assets (images, fonts) before revealing the main content.
*   **Typography & Copywriting:** NEVER use a hyphen followed by a space ("- "), nor any en dashes (–) or em dashes (—) in any text, paragraphs, or headings across any project. Use proper punctuation (such as commas, semicolons, colons, or parentheses) where grammatically appropriate, and strictly avoid these dash formats.
*   **Aesthetics:** Always prioritize premium, modern web design principles (vibrant palettes, sleek typography, micro-animations, and dynamic hover effects).

## 2. Tech Stack Recommendations

### A. Static & Visual-Heavy Sites (e.g., Portfolios, Landing Pages)
*   **Stack:** Vanilla HTML, Vanilla CSS, Vanilla JavaScript.
*   **Focus:** High performance, custom DOM animations, and pixel-perfect layouts.

### B. Dynamic Sites with Light Backend (e.g., Booking Sites)
*   **Stack:** 
    *   Frontend: Vanilla JS or React (Next.js),TypeScript, Tailwind CSS, Framer Motion
    *   Backend/DB: Supabase or Firebase for quick database integration.
*   **Focus:** Secure data handling (bookings, forms) mixed with premium frontend design.

### C. Full Web Applications
*   **Stack:** Next.js (Frontend), Node.js/Express (Backend), PostgreSQL (Database).
*   **Focus:** Scalability, complex state management, and custom APIs.

## 3. Workflow
1.  Establish the appropriate Tech Stack based on the project's data needs.
2.  Design the UI with a focus on "wowing" the user.
3.  Implement the global Preloader.
4.  Develop components ensuring global typography rules (no "- ") are strictly followed.
