export interface Expense {
    id: string;
    amount: number;
    category: string;
    date: string;
    note: string;
}

export interface CreateExpenseDto {
    amount: number;
    category: string;
    date: string;
    note: string;
}

export interface UpdateExpenseDto {
    amount: number;
    category: string;
    date: string;
    note: string;
}

export interface CategorySummary {
    [category: string]: number;
}

export interface DateRange {
    start: string;
    end: string;
}
