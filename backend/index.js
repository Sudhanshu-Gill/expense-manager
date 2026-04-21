const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Expense = require("./models/Expense");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB (ENV)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// TEST
app.get("/", (req, res) => {
  res.send("API Running");
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  res.send("User registered successfully");
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.log(error);
    res.json({ message: "Error in login" });
  }
});

// ================= AUTH =================
const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.send("No token");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch {
    res.send("Invalid token");
  }
};

// ================= ADD EXPENSE =================
app.post("/expense", auth, async (req, res) => {
  const { title, amount, category, date } = req.body;

  const expense = new Expense({
    userId: req.userId,
    title,
    amount,
    category,
    date
  });

  await expense.save();
  res.send("Expense added");
});

// ================= GET EXPENSE =================
app.get("/expenses", auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId });
  res.json(expenses);
});

// PORT FIX
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});