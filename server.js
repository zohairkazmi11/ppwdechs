const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// =========================
// SERVE FRONTEND (IMPORTANT FIX)
// =========================
app.use(express.static(path.join(__dirname, "public")));

// =========================
// LOAD USERS FILE
// =========================
const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// =========================
// HOME ROUTE (FIX / ERROR)
// =========================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// =========================
// LOGIN ROUTE
// =========================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    let users = readUsers();

    const admin = users.find(
        u => u.role === "admin" && u.CNIC === username && u.password === password
    );

    if (admin) {
        return res.json({ success: true, role: "admin" });
    }

    const user = users.find(u => u.CNIC === username);

    if (user) {
        return res.json({ success: true, role: "user", cnic: user.CNIC });
    }

    res.json({ success: false, message: "Invalid login" });
});

// =========================
// GET USERS
// =========================
app.get("/users", (req, res) => {
    res.json(readUsers());
});

// =========================
// UPDATE PHONE
// =========================
app.post("/update-user-phone", (req, res) => {

    const { CNIC, Phone } = req.body;

    let users = readUsers();

    let user = users.find(u => u.CNIC === CNIC);

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    user.Phone = Phone;

    saveUsers(users);

    res.json({
        success: true,
        message: "Phone updated successfully"
    });
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});