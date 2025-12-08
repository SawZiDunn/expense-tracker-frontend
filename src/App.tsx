import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { fetchExpenses, fetchCategorySummary } from "./features/expenseSlice";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";
import FilterBar from "./components/FilterBar";

function ExpenseTracker() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchExpenses());
        dispatch(fetchCategorySummary());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Expense Tracker
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form & Dashboard */}
                    <div className="lg:col-span-1 space-y-6">
                        <ExpenseForm />
                        <Dashboard />
                    </div>

                    {/* Right Column - Filter & List */}
                    <div className="lg:col-span-2">
                        <FilterBar />
                        <ExpenseList />
                    </div>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <Provider store={store}>
            <ExpenseTracker />
        </Provider>
    );
}

export default App;
