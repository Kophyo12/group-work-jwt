require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const Student = require("./models/Student");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth")


const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send(`
        <h1>Database-backed Student API</h1>
        <p>This API uses MongoDB instead of students.json.</p>
        <ul>
            <li>GET /api/students</li>
            <li>POST /api/students</li>
            <li>GET /api/students/:id</li>
        </ul>
    `);
});

// GET all students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

// POST a new student
app.post("/api/students", auth, async (req, res) => {
    try {
        const created = await Student.create(req.body);

        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// GET one student by ID
app.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(404).json({
            error: "Invalid student ID"
        });
    }
});

app.use("/api/auth", authRoutes);

// Handle routes that do not exist
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});
