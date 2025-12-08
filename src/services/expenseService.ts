import axios from "axios";
import type {
    Expense,
    CreateExpenseDto,
    UpdateExpenseDto,
    CategorySummary,
} from "../types/expense";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const expenseApi = {
    // Get all expenses
    getAll: async (): Promise<Expense[]> => {
        const response = await api.get<Expense[]>("/expenses");
        return response.data;
    },

    // Get expense by ID
    getById: async (id: string): Promise<Expense> => {
        const response = await api.get<Expense>(`/expenses/${id}`);
        return response.data;
    },

    // Create new expense
    create: async (expense: CreateExpenseDto): Promise<Expense> => {
        const response = await api.post<Expense>("/expenses", expense);
        return response.data;
    },

    // Update expense
    update: async (id: string, expense: UpdateExpenseDto): Promise<void> => {
        await api.put(`/expenses/${id}`, expense);
    },

    // Delete expense
    delete: async (id: string): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },

    // Filter by date range
    filterByDateRange: async (
        start: string,
        end: string
    ): Promise<Expense[]> => {
        const response = await api.get<Expense[]>("/expenses/filter", {
            params: { start, end },
        });
        return response.data;
    },

    // Get category summary
    getCategorySummary: async (): Promise<CategorySummary> => {
        const response = await api.get<CategorySummary>("/expenses/summary");
        return response.data;
    },

    // Get category summary by date range
    getCategorySummaryByDateRange: async (
        start: string,
        end: string
    ): Promise<CategorySummary> => {
        const response = await api.get<CategorySummary>(
            "/expenses/summary/filter",
            {
                params: { start, end },
            }
        );
        return response.data;
    },
};
