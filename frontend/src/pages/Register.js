import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://expense-manager-ks7a.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.text();

      if (data === "User already exists") {
        setMessage("❌ User already exists");
      } else {
        setMessage("✅ Registered successfully");

        // 2 sec baad login page pe bhej dega
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (err) {
      setMessage("❌ Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Register;