import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    fetchExpenses,
    fetchExpensesByDateRange,
    setFilter,
    fetchCategorySummaryByDateRange,
    fetchCategorySummary,
} from "../features/expenseSlice";

export default function FilterBar() {
    const dispatch = useAppDispatch();
    const filter = useAppSelector((state) => state.expenses.filter);

    const [startDate, setStartDate] = useState(filter?.startDate || "");
    const [endDate, setEndDate] = useState(filter?.endDate || "");

    const handleFilter = async () => {
        if (startDate && endDate) {
            dispatch(setFilter({ startDate, endDate }));
            await dispatch(
                fetchExpensesByDateRange({
                    start: new Date(startDate).toISOString(),
                    end: new Date(endDate).toISOString(),
                })
            );
            await dispatch(
                fetchCategorySummaryByDateRange({
                    start: new Date(startDate).toISOString(),
                    end: new Date(endDate).toISOString(),
                })
            );
        }
    };

    const handleClearFilter = async () => {
        setStartDate("");
        setEndDate("");
        dispatch(setFilter(null));
        await dispatch(fetchExpenses());
        await dispatch(fetchCategorySummary());
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleFilter}
                        disabled={!startDate || !endDate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Apply Filter
                    </button>

                    {filter && (
                        <button
                            onClick={handleClearFilter}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {filter && (
                <div className="mt-3 text-sm text-gray-600">
                    Showing expenses from{" "}
                    {new Date(filter.startDate).toLocaleDateString()} to{" "}
                    {new Date(filter.endDate).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}
