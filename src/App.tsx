import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { fetchExpenses, fetchCategorySummary } from "./features/expenseSlice";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";
import FilterBar from "./components/FilterBar";
import Modal from "./components/Modal";

function ExpenseTracker() {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchExpenses());
        dispatch(fetchCategorySummary());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Expense Tracker
                        </h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Expense
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Dashboard at the top */}
                    <Dashboard />

                    {/* Filter & List */}
                    <div>
                        <FilterBar />
                        <ExpenseList />
                    </div>
                </div>
            </main>

            {/* Modal for adding/editing expenses */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Expense"
                size="lg"
            >
                <ExpenseForm onClose={() => setIsModalOpen(false)} />
            </Modal>
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
