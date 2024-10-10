const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'hungg', // Thay bằng tên người dùng MySQL của bạn
    password: '123456', // Thay bằng mật khẩu MySQL của bạn
    database: 'hung' // Thay bằng tên cơ sở dữ liệu của bạn
});

// Kiểm tra kết nối
db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối tới cơ sở dữ liệu:', err);
        return;
    }
    console.log('Kết nối tới cơ sở dữ liệu MySQL thành công!');
});

// Đăng ký người dùng
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Đăng ký thất bại!', error: err });
        } else {
            res.status(200).json({ message: 'Đăng ký thành công!' });
        }
    });
});

// Đăng nhập người dùng
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Đăng nhập thất bại!', error: err });
        } else if (result.length > 0) {
            res.status(200).json({ message: 'Đăng nhập thành công!', user: result[0] });
        } else {
            res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }
    });
});

// Chạy server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
