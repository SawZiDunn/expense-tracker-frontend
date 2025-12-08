import { useAppSelector } from "../hooks";
import ExpenseItem from "./ExpenseItem";

export default function ExpenseList() {
    const { expenses, loading, error } = useAppSelector(
        (state) => state.expenses
    );

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading expenses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg">No expenses found</p>
                <p className="text-gray-500 text-sm mt-2">
                    Add your first expense to get started
                </p>
            </div>
        );
    }

    const sortedExpenses = [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                    Expenses ({expenses.length})
                </h2>
            </div>
            <div>
                {sortedExpenses.map((expense) => (
                    <ExpenseItem key={expense.id} expense={expense} />
                ))}
            </div>
        </div>
    );
}
