# Expense Tracker Frontend

React + TypeScript + Vite + Tailwind CSS + Redux Toolkit application for tracking expenses.

## Features

-   ✅ Add, edit, and delete expenses
-   ✅ Filter expenses by date range
-   ✅ Category-based expense breakdown
-   ✅ Real-time dashboard with summaries
-   ✅ Responsive design with Tailwind CSS
-   ✅ State management with Redux Toolkit
-   ✅ TypeScript for type safety

## Prerequisites

-   Node.js 18+ and npm
-   Backend API running on `http://localhost:5000`

## Setup

1. **Install Dependencies**

    ```bash
    npm install
    ```

2. **Environment Variables (Optional)**

    Create a `.env` file if you need to customize the API URL:

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

## Project Structure

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseItem.tsx
│   │   ├── ExpenseList.tsx
│   │   └── FilterBar.tsx
│   ├── features/          # Redux slices
│   │   └── expenseSlice.ts
│   ├── services/          # API services
│   │   └── expenseService.ts
│   ├── types/             # TypeScript types
│   │   └── expense.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   ├── store.ts           # Redux store
│   └── hooks.ts           # Custom hooks
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

## Tech Stack

-   **React 18** - UI library
-   **TypeScript** - Type safety
-   **Vite** - Build tool
-   **Tailwind CSS** - Styling
-   **Redux Toolkit** - State management
-   **Axios** - HTTP client
-   **date-fns** - Date formatting

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

## API Integration

The frontend connects to the backend API at `http://localhost:5000` with the following endpoints:

-   `GET /expenses` - Fetch all expenses
-   `POST /expenses` - Create new expense
-   `PUT /expenses/{id}` - Update expense
-   `DELETE /expenses/{id}` - Delete expense
-   `GET /expenses/filter?start=&end=` - Filter by date
-   `GET /expenses/summary` - Get category summary
