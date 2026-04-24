const express = require("express");
const app = express();

/* MIDDLEWARE */
app.use(express.json());
app.use(express.static(__dirname));

/* USERS (temporary database) */
const users = [
    { id: 1, username: "admin", password: "1234", role: "admin" },
    { id: 2, username: "user1", password: "1111", role: "user" }
];

/* LOGIN API */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({
        success: true,
        userId: user.id,
        role: user.role
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

/* PAGES ROUTES */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

app.get("/user", (req, res) => {
    res.sendFile(__dirname + "/user.html");
});

/* START SERVER (Render compatible) */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});