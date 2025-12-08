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
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Education",
    "Other",
];

export default function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
    const dispatch = useAppDispatch();
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
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
        >
            <h2 className="text-2xl font-bold mb-4">
                {expense ? "Edit Expense" : "Add New Expense"}
            </h2>

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
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {expense ? "Update" : "Add"} Expense
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
