const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Routes
app.get("/api/notes", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile("db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error("Error writing to db.json:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(newNote);
      }
    });
  });
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
