import express from "express";
import mysql from "mysql2"; // Changed to mysql2
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "192.168.0.100", // or "db" if using Docker
  user: "root",
  password: "root",
  database: "test",
  port: 3306, // Changed to default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add connection error handling
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', db.threadId);
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `description`, `price`, `cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Insert failed" });
    }
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Delete failed" });
    }
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `description`= ?, `price`= ?, `cover`= ? WHERE id = ?";
  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Update failed" });
    }
    return res.json(data);
  });
});

app.listen(3005, () => {
  console.log("Backend server running on port 3005");
});