import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch expenses
  const fetchExpenses = async () => {
    const res = await fetch("https://expense-manager-ks7a.onrender.com/expenses", {
      headers: {
        authorization: token
      }
    });

    const data = await res.json();
    setExpenses(data);
  };

  // Add expense
  const addExpense = async () => {
    await fetch("https://expense-manager-ks7a.onrender.com/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify(form)
    });

    fetchExpenses();
  };

  // Protect route
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchExpenses();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 max-w-xl mx-auto">
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Title"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Amount"
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Category"
          onChange={e => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <button
          onClick={addExpense}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="max-w-xl mx-auto">
        {expenses.map(e => (
          <div
            key={e._id}
            className="bg-white p-3 rounded shadow mb-3 flex justify-between"
          >
            <span>{e.title} ({e.category})</span>
            <span>₹{e.amount}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;