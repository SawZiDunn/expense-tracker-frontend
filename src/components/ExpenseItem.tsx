import { useState } from "react";
import { format } from "date-fns";
import { useAppDispatch } from "../hooks";
import { deleteExpense } from "../features/expenseSlice";
import type { Expense } from "../types/expense";
import ExpenseForm from "./ExpenseForm";

interface ExpenseItemProps {
    expense: Expense;
}

export default function ExpenseItem({ expense }: ExpenseItemProps) {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            await dispatch(deleteExpense(expense.id));
        }
    };

    if (isEditing) {
        return (
            <div className="border-b pb-4">
                <ExpenseForm
                    expense={expense}
                    onClose={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {expense.category}
                    </span>
                    <span className="text-sm text-gray-500">
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                    </span>
                </div>
                {expense.note && (
                    <p className="text-gray-700 mt-1">{expense.note}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">
                    ${expense.amount.toFixed(2)}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
