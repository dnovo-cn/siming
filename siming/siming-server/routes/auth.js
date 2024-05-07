const express = require('express');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { query } = require('../db/index');

const router = express.Router();

// 用户登录接口
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    query(sql, [username], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = rows[0];

        if (password == user.password) {
            res.json({ message: 'Login successful' });
        } else {
            res.json({ message: 'Login failed' });
        }

    });
});

router.post('/register', async (req, res) => {
    const { username, password, email, full_name } = req.body;

    try {
        const sql = 'SELECT * FROM users WHERE username = ?';
        query(sql, [username], (error, results) => {
            if (error) {
                console.error('注册失败:', error);
                return res.status(500).json({ message: '注册失败' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: '用户名已存在' });
            }
            const userId = uuid.v4();
            const hashedPassword = bcrypt.hashSync(password, 10);
            const addSql = 'INSERT INTO users (user_id, username, password, email, full_name) VALUES (?, ?, ?, ?, ?)';
            query(addSql, [userId, username, hashedPassword, email, full_name], (error) => {
                if (error) {
                    console.error('注册失败:', error);
                    return res.status(500).json({ message: '注册失败' });
                }
                res.status(200).json({ message: '注册成功' });
            }
            );

        });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ message: '注册失败' });
    }
});

module.exports = router;