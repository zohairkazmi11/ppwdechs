const xlsx = require("xlsx");
const express = require("express");
const path = require("path");

const app = express();

/* ======================
   LOAD EXCEL DATA
====================== */
const workbook = xlsx.readFile(
    path.join(__dirname, "ppwdechs_users.xlsx")
);

const sheet = workbook.Sheets[workbook.SheetNames[0]];
const excelUsers = xlsx.utils.sheet_to_json(sheet);

/* ======================
   MIDDLEWARE
====================== */
app.use(express.json());
app.use(express.static(__dirname));

/* ======================
   ADMIN DATA
====================== */
const admins = [
    { username: "admin", password: "1234" }
];

/* ======================
   LOGIN API
====================== */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // ADMIN LOGIN
    const admin = admins.find(
        a => a.username === username && a.password === password
    );

    if (admin) {
        return res.json({ success: true, role: "admin" });
    }

    // USER LOGIN (CNIC)
    const user = excelUsers.find(
        u => String(u.CNIC).trim() === String(username).trim()
    );

    if (user) {
        return res.json({ success: true, role: "user" });
    }

    return res.json({
        success: false,
        message: "Invalid login"
    });
});

/* ======================
   GET ALL USERS (ADMIN)
====================== */
app.get("/users", (req, res) => {
    res.json(excelUsers);
});

/* ======================
   GET SINGLE CNIC
====================== */
app.get("/cnic/:cnic", (req, res) => {
    const user = excelUsers.find(
        u => String(u.CNIC).trim() === String(req.params.cnic).trim()
    );

    if (!user) {
        return res.json({ message: "No record found" });
    }

    res.json(user);
});

/* ======================
   PAGES
====================== */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/user", (req, res) => {
    res.sendFile(path.join(__dirname, "user.html"));
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});