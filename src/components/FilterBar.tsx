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

    const applyDateRange = async (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        dispatch(setFilter({ startDate: start, endDate: end }));

        // Create dates at start of day (00:00:00) and end of day (23:59:59)
        const startDate = new Date(start + "T00:00:00");
        const endDate = new Date(end + "T23:59:59");

        await dispatch(
            fetchExpensesByDateRange({
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            })
        );
        await dispatch(
            fetchCategorySummaryByDateRange({
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            })
        );
    };

    const handlePresetPeriod = (period: string) => {
        const now = new Date();
        // Get local date string (YYYY-MM-DD)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;

        let startStr: string;
        let endStr: string = todayStr;

        switch (period) {
            case "today":
                startStr = todayStr;
                break;
            case "yesterday": {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                const y = yesterday.getFullYear();
                const m = String(yesterday.getMonth() + 1).padStart(2, "0");
                const d = String(yesterday.getDate()).padStart(2, "0");
                startStr = `${y}-${m}-${d}`;
                endStr = startStr;
                break;
            }
            case "lastWeek": {
                // Last 7 days including today (6 days ago to today)
                const lastWeek = new Date(now);
                lastWeek.setDate(lastWeek.getDate() - 6);
                const y = lastWeek.getFullYear();
                const m = String(lastWeek.getMonth() + 1).padStart(2, "0");
                const d = String(lastWeek.getDate()).padStart(2, "0");
                startStr = `${y}-${m}-${d}`;
                break;
            }
            case "lastMonth": {
                // Last 30 days including today (29 days ago to today)
                const lastMonth = new Date(now);
                lastMonth.setDate(lastMonth.getDate() - 29);
                const y = lastMonth.getFullYear();
                const m = String(lastMonth.getMonth() + 1).padStart(2, "0");
                const d = String(lastMonth.getDate()).padStart(2, "0");
                startStr = `${y}-${m}-${d}`;
                break;
            }
            default:
                return;
        }

        applyDateRange(startStr, endStr);
    };

    const handleFilter = async () => {
        if (startDate && endDate) {
            applyDateRange(startDate, endDate);
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
            {/* Quick Period Filters */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Filters
                </label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handlePresetPeriod("today")}
                        className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => handlePresetPeriod("yesterday")}
                        className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium"
                    >
                        Yesterday
                    </button>
                    <button
                        onClick={() => handlePresetPeriod("lastWeek")}
                        className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium"
                    >
                        Last Week
                    </button>
                    <button
                        onClick={() => handlePresetPeriod("lastMonth")}
                        className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors font-medium"
                    >
                        Last Month
                    </button>
                </div>
            </div>

            {/* Custom Date Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Date Range
                </label>
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
