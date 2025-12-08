import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { fetchCategorySummary } from "../features/expenseSlice";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { expenses, categorySummary, filter } = useAppSelector(
        (state) => state.expenses
    );

    useEffect(() => {
        if (filter) {
            // Summary will be updated when filter is applied
        } else {
            dispatch(fetchCategorySummary());
        }
    }, [dispatch, expenses, filter]);

    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const chartData = Object.entries(categorySummary).sort(
        (a, b) => b[1] - a[1]
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>

            {/* Total Expenses */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-6 text-white">
                <p className="text-sm opacity-90 mb-1">Total Expenses</p>
                <p className="text-4xl font-bold">
                    ${totalExpenses.toFixed(2)}
                </p>
                <p className="text-sm opacity-90 mt-2">
                    {expenses.length} transaction
                    {expenses.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Category Breakdown */}
            {chartData.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                        Category Breakdown
                    </h3>
                    <div className="space-y-3">
                        {chartData.map(([category, amount]) => {
                            const percentage =
                                totalExpenses > 0
                                    ? (amount / totalExpenses) * 100
                                    : 0;
                            return (
                                <div key={category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">
                                            {category}
                                        </span>
                                        <span className="text-gray-600">
                                            ${amount.toFixed(2)} (
                                            {percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {chartData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No data to display</p>
                    <p className="text-sm mt-1">
                        Add some expenses to see the breakdown
                    </p>
                </div>
            )}
        </div>
    );
}
