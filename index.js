const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.json({ message: "OK" });
});

app.post("/messages", async (req, res) => {
  const { contenu } = req.body;

  if (!contenu) {
    return res.status(400).json({ error: "contenu requis" });
  }

  const result = await pool.query(
    "INSERT INTO messages(contenu) VALUES($1) RETURNING *",
    [contenu]
  );

  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Serveur démarré sur le port " + PORT);
});
