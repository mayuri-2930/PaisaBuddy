// import React, { useState, useEffect } from "react";
// import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from "../services/TransactionService";
// import { TransactionCard } from "../components/TransactionCard";
// import Loader from "../components/Loader";
// import ErrorMessage from "../components/ErrorMessage";

// export default function TransactionPage() {
//   const [transactions, setTransactions] = useState([]);
//   const [form, setForm] = useState({ title: "", amount: 0, category: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editing, setEditing] = useState(null);
//   const [filter, setFilter] = useState("");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await getTransactions();
//       setTransactions(res.data);
//     } catch (err) {
//       setError("Failed to fetch transactions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!form.title) return setError("Title is required");
//     if (form.amount <= 0) return setError("Amount must be positive");
//     if (!form.category) return setError("Category is required");

//     try {
//       if (editing) {
//         await updateTransaction(editing.id, form);
//         setEditing(null);
//       } else {
//         await createTransaction(form);
//       }
//       setForm({ title: "", amount: 0, category: "" });
//       fetchTransactions();
//     } catch {
//       setError("Failed to save transaction");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteTransaction(id);
//       setTransactions(transactions.filter((t) => t.id !== id)); // optimistic update
//     } catch {
//       setError("Failed to delete transaction");
//     }
//   };

//   const handleEdit = (transaction) => {
//     setEditing(transaction);
//     setForm({ title: transaction.title, amount: transaction.amount, category: transaction.category });
//   };

//   const filteredTransactions = transactions
//     .filter((t) => !filter || t.category === filter)
//     .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

//   const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

//   return (
//     <div className="p-6 max-w-xl mx-auto text-white bg-gradient-to-b from-purple-900 via-violet-900 to-indigo-900 min-h-screen">
//       <h2 className="text-3xl font-bold mb-4 text-center">Paisa Buddy</h2>

//       {error && <ErrorMessage message={error} />}
//       {loading && <Loader />}

//       <div className="mb-4 flex gap-2">
//         <input
//           type="text"
//           placeholder="Search by title..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 px-2 py-1 rounded text-black"
//         />
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="px-2 py-1 rounded text-black"
//         >
//           <option value="">All Categories</option>
//           <option value="Food">Food</option>
//           <option value="Transport">Transport</option>
//           <option value="Entertainment">Entertainment</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       <form onSubmit={handleSubmit} className="mb-6 space-y-2">
//         <input
//           type="text"
//           placeholder="Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           className="w-full px-2 py-1 rounded text-black"
//         />
//         <input
//           type="number"
//           placeholder="Amount"
//           value={form.amount}
//           onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
//           className="w-full px-2 py-1 rounded text-black"
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           value={form.category}
//           onChange={(e) => setForm({ ...form, category: e.target.value })}
//           className="w-full px-2 py-1 rounded text-black"
//         />
//         <button type="submit" className="w-full bg-yellow-500 py-1 rounded hover:bg-yellow-600 transition-colors">
//           {editing ? "Update Transaction" : "Add Transaction"}
//         </button>
//       </form>

//       <p className="text-right font-bold mb-2">Total: ${totalAmount}</p>

//       {filteredTransactions.map((t) => (
//         <TransactionCard key={t.id} transaction={t} onDelete={handleDelete} onEdit={handleEdit} />
//       ))}
//     </div>
//   );
// }
// 
import React, { useState, useEffect } from "react";
import { getTransactions, createTransaction, deleteTransaction } from "../services/TransactionService";
import { TransactionCard } from "../components/TransactionCard";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", amount: 0, category: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || form.amount <= 0 || !form.category) {
      setError("Please fill all fields with valid values");
      return;
    }
    try {
      await createTransaction(form);
      setForm({ title: "", amount: 0, category: "" });
      fetchTransactions();
      setError("");
    } catch (err) {
      setError("Failed to create transaction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id)); // Optimistic update
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-violet-700 to-indigo-500 text-white p-6">
      <h2 className="mt-70  font-bold mb-4 text-center text-5xl text-shadow-amber-900">Paisa Buddy</h2>
      <div className="max-w-md mx-auto">
        {/* <div className="text-lg font-semibold mb-4">Total: ${totalAmount}</div> */}

        {/* Error Message */}
        {error && <div className="bg-red-500 p-2 rounded mb-4">{error}</div>}

        {/* Add Transaction Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-purple-500 bg-purple-900 text-white px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            className="w-full border border-purple-500 bg-purple-900 text-white px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-purple-500 bg-purple-900 text-white px-2 py-1 rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-1 rounded"
          >
            Add Transaction
          </button>
        </form>

         <p className="text-right font-bold mb-2">Total: ${totalAmount}</p> 

        {/* Loading */}
        {loading && <div className="text-center mb-4">Loading...</div>}

        {/* Transactions List */}
        {transactions.map((t) => (
          <TransactionCard key={t.id} transaction={t} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}