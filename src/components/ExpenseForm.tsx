import { useState } from "react";
import { useAppDispatch } from "../hooks";
import { createExpense, updateExpense } from "../features/expenseSlice";
import type { Expense } from "../types/expense";

interface ExpenseFormProps {
    expense?: Expense;
    onClose?: () => void;
}

const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Education",
    "Other",
];

export default function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: expense?.amount.toString() || "",
        category: expense?.category || "Food",
        date:
            expense?.date.split("T")[0] ||
            new Date().toISOString().split("T")[0],
        note: expense?.note || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const expenseData = {
                amount: parseFloat(formData.amount),
                category: formData.category,
                date: new Date(formData.date).toISOString(),
                note: formData.note,
            };

            if (expense) {
                await dispatch(
                    updateExpense({ id: expense.id, expense: expenseData })
                );
            } else {
                await dispatch(createExpense(expenseData));
            }

            setFormData({
                amount: "",
                category: "Food",
                date: new Date().toISOString().split("T")[0],
                note: "",
            });

            onClose?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white">
            {!onClose && (
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    {expense ? "Edit Expense" : "Add New Expense"}
                </h2>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note
                    </label>
                    <textarea
                        value={formData.note}
                        onChange={(e) =>
                            setFormData({ ...formData, note: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Add a note (optional)"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {expense ? "Updating..." : "Adding..."}
                            </>
                        ) : (
                            <>{expense ? "Update" : "Add"} Expense</>
                        )}
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
