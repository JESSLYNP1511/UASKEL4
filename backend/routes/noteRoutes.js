// backend/routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const { createNote, getNotes, updateNote, deleteNote } = require("../controllers/noteController");

// Route untuk membuat catatan baru
router.post("/", createNote);

// Route untuk mendapatkan semua catatan
router.get("/", getNotes);

// Route untuk memperbarui catatan
router.put("/:id", updateNote);

// Route untuk menghapus catatan
router.delete("/:id", deleteNote);

module.exports = router;
