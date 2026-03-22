const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.static('public'));


// 👉 Homepage
app.get('/', (req, res) => {
    res.send("🚑 Server is working");
});


// 👉 Get accidents
app.get('/accidents', verifyToken, (req, res) => {
    db.query("SELECT * FROM ACCIDENT", (err, result) => {
        res.json(result);
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running");
});

// 👉 REPORT ACCIDENT
app.post('/report', verifyToken, (req, res) => {
    const { type, severity, user_id, location_id } = req.body;

    const sql = `
    INSERT INTO ACCIDENT 
    (accident_type, accident_time, severity, status, user_id, location_id)
    VALUES (?, NOW(), ?, 'Pending', ?, ?)
    `;

    db.query(sql, [type, severity, user_id, location_id], (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.send("✅ Accident Reported");
        }
    });
});

// 👉 Update accident status
app.put('/update/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    const sql = `
    UPDATE ACCIDENT 
    SET status = 'Handled'
    WHERE accident_id = ?
    `;

    db.query(sql, [id], (err) => {
        if (err) res.send(err);
        else res.send("Updated");
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 🔥 TEMP LOGIN (NO DATABASE)
    if (username === "user2" && password === "1234") {

        const token = jwt.sign(
            { id: 1, role: "user" },
            SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token: token,
            role: "user"
        });
    }

    if (username === "responder2" && password === "1234") {

        const token = jwt.sign(
            { id: 2, role: "responder" },
            SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token: token,
            role: "responder"
        });
    }

    res.json({ success: false });
});
function verifyToken(req, res, next) {

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: "No token ❌" });
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token ❌" });
    }
}
// create user (temporary API)
app.get('/create-user', async (req, res) => {
    const username = 'responder2';
    const password = '1234';
    const role = 'responder';
    console.log("Creating user:", username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
    INSERT INTO USERS (username, password, role)
    VALUES (?, ?, ?)
    `;

    db.query(sql, [username, hashedPassword, role], (err) => {
        if (err) res.send(err);
        else res.send("User created with encrypted password ✅");
    });
});
const SECRET = "mysecretkey";
function verifyToken(req, res, next) {

    const token = req.headers['authorization'];

    if (!token) {
        return res.send("Access denied ❌");
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.send("Invalid token ❌");
    }
}
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));