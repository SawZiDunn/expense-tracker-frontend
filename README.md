# Expense Tracker Frontend

**React + JavaScript + Vite + Tailwind CSS + Redux Toolkit** application for tracking expenses.

## Features Overview

### Dashboard

-   Total expenses display
-   Category breakdown with percentage bars
-   Real-time updates

### Expense Management

-   Create new expenses with amount, category, date, and note
-   Edit existing expenses inline
-   Delete expenses with confirmation

### Filtering

-   Filter expenses by date range
-   Clear filters to view all expenses
-   Summary updates based on filters

## Prerequisites

-   Node.js 18+ and npm
-   Backend API (see backend repository)

## Setup

1. **Install Dependencies**

    ```bash
    npm install
    ```

2. **Environment Variables**

    Copy the example env file:

    ```bash
    cp .env.example .env.development
    ```

    Update `.env.development` with your backend API URL:

    ```
    VITE_API_URL=http://localhost:5000
    ```

3. **Run Development Server**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173`

4. **Build for Production**
    ```bash
    npm run build
    ```

## Environment Variables

-   `VITE_API_URL` - Base URL for the backend API (e.g. `http://localhost:5000`)

## Tech Stack

-   **React 18** - UI library
-   **TypeScript** - Type safety
-   **Vite** - Build tool
-   **Tailwind CSS** - Styling
-   **Redux Toolkit** - State management
-   **Axios** - HTTP client
-   **date-fns** - Date formatting

## API Integration

The frontend connects to the backend API at `http://localhost:5000` with the following endpoints:

-   `GET /expenses` - Fetch all expenses
-   `POST /expenses` - Create new expense
-   `PUT /expenses/{id}` - Update expense
-   `DELETE /expenses/{id}` - Delete expense
-   `GET /expenses/filter?start=&end=` - Filter by date
-   `GET /expenses/summary` - Get category summary
