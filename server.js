const express = require("express");
const app = express();

/* MIDDLEWARE */
app.use(express.json());
app.use(express.static(__dirname));

/* TEMP DATABASE */
const users = [
    { id: 1, username: "admin", password: "1234", role: "admin" },
    { id: 2, username: "user1", password: "", role: "user" } // CNIC users (no password)
];

/* LOGIN API (NEW FLOW) */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // 🔐 ADMIN LOGIN (2-step logic)
    if (username === "admin") {
        if (!password) {
            return res.json({ step: "password_required" });
        }

        if (password === "1234") {
            return res.json({
                success: true,
                role: "admin",
                userId: 1
            });
        } else {
            return res.json({
                success: false,
                message: "Wrong admin password"
            });
        }
    }

    // 👤 USER LOGIN (CNIC / username only)
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    return res.json({
        success: true,
        role: "user",
        userId: user.id
    });
});

/* GET USER (ADMIN FEATURE) */
app.get("/user/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.json({ message: "User not found" });
    }

    res.json(user);
});

/* PAGES */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

app.get("/user", (req, res) => {
    res.sendFile(__dirname + "/user.html");
});

/* START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});