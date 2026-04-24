const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

/* USERS */
const users = [
    { id: 1, username: "admin", password: "1234", role: "admin" },
    { id: 2, username: "user1", password: "1111", role: "user" }
];

/* LOGIN */
app.post("/login", (req, res) => {
    const { username, password } = req.body;
 
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ success: false });
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
    res.json(user || { message: "Not found" });
});

/* FRONTEND PAGES */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/admin.html", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

app.get("/user.html", (req, res) => {
    res.sendFile(__dirname + "/user.html");
});

/* START SERVER (ALWAYS LAST) */
app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on network");
});