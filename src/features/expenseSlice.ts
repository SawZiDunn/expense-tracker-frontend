import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { expenseApi } from "../services/expenseService";
import type {
    Expense,
    CreateExpenseDto,
    UpdateExpenseDto,
    CategorySummary,
} from "../types/expense";

interface ExpenseState {
    expenses: Expense[];
    categorySummary: CategorySummary;
    loading: boolean;
    error: string | null;
    filter: {
        startDate: string;
        endDate: string;
    } | null;
}

const initialState: ExpenseState = {
    expenses: [],
    categorySummary: {},
    loading: false,
    error: null,
    filter: null,
};

// Async thunks
export const fetchExpenses = createAsyncThunk("expenses/fetchAll", async () => {
    return await expenseApi.getAll();
});

export const fetchExpensesByDateRange = createAsyncThunk(
    "expenses/fetchByDateRange",
    async ({ start, end }: { start: string; end: string }) => {
        return await expenseApi.filterByDateRange(start, end);
    }
);

export const createExpense = createAsyncThunk(
    "expenses/create",
    async (expense: CreateExpenseDto) => {
        return await expenseApi.create(expense);
    }
);

export const updateExpense = createAsyncThunk(
    "expenses/update",
    async ({ id, expense }: { id: string; expense: UpdateExpenseDto }) => {
        await expenseApi.update(id, expense);
        return { id, expense };
    }
);

export const deleteExpense = createAsyncThunk(
    "expenses/delete",
    async (id: string) => {
        await expenseApi.delete(id);
        return id;
    }
);

export const fetchCategorySummary = createAsyncThunk(
    "expenses/fetchCategorySummary",
    async () => {
        return await expenseApi.getCategorySummary();
    }
);

export const fetchCategorySummaryByDateRange = createAsyncThunk(
    "expenses/fetchCategorySummaryByDateRange",
    async ({ start, end }: { start: string; end: string }) => {
        return await expenseApi.getCategorySummaryByDateRange(start, end);
    }
);

const expenseSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        setFilter: (
            state,
            action: PayloadAction<{ startDate: string; endDate: string } | null>
        ) => {
            state.filter = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload;
                state.filter = null;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch expenses";
            })
            // Fetch by date range
            .addCase(fetchExpensesByDateRange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpensesByDateRange.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload;
            })
            .addCase(fetchExpensesByDateRange.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to filter expenses";
            })
            // Create expense
            .addCase(createExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses.push(action.payload);
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to create expense";
            })
            // Update expense
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.expenses.findIndex(
                    (e) => e.id === action.payload.id
                );
                if (index !== -1) {
                    state.expenses[index] = {
                        ...action.payload.expense,
                        id: action.payload.id,
                    };
                }
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to update expense";
            })
            // Delete expense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = state.expenses.filter(
                    (e) => e.id !== action.payload
                );
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to delete expense";
            })
            // Fetch category summary
            .addCase(fetchCategorySummary.fulfilled, (state, action) => {
                state.categorySummary = action.payload;
            })
            .addCase(
                fetchCategorySummaryByDateRange.fulfilled,
                (state, action) => {
                    state.categorySummary = action.payload;
                }
            );
    },
});

export const { setFilter, clearError } = expenseSlice.actions;

// Selectors
export const selectAllExpenses = (state: { expenses: ExpenseState }) =>
    state.expenses.expenses;
export const selectExpensesLoading = (state: { expenses: ExpenseState }) =>
    state.expenses.loading;
export const selectExpensesError = (state: { expenses: ExpenseState }) =>
    state.expenses.error;
export const selectCategorySummary = (state: { expenses: ExpenseState }) =>
    state.expenses.categorySummary;
export const selectFilter = (state: { expenses: ExpenseState }) =>
    state.expenses.filter;

export default expenseSlice.reducer;
