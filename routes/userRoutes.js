const express = require('express');
const fs = require('fs');
const router = express.Router();
router.post('/', (req, res) => {
  const { username, password, fullName, age, email, gender } = req.body;

  if (username.length < 3,  password.length < 5 , age < 10) {
    return res.status(400).json({ message: 'data' });
  }

  const users = JSON.parse(fs.readFileSync('./database/users.json'));
  const existingUser = users.find(user => user.username === username || user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }
  const newUser = {
    id: users.length + 1,
    username,
    password,
    fullName,
    age,
    email,
    gender
  };
  users.push(newUser);
  fs.writeFileSync('./database/users.json', JSON.stringify(users, null, 2));

  res.status(201).json(newUser);
});
router.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./database/users.json'));
  const user = users.find(user => (user.username === username || user.email === email) && user.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  res.status(200).json({ message: 'Login successful', user });
});
router.get('/:usernameOrEmail', (req, res) => {
  const { usernameOrEmail } = req.params;
  const users = JSON.parse(fs.readFileSync('./database/users.json'));
  const user = users.find(user => user.username === usernameOrEmail || user.email === usernameOrEmail);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});
router.put('/:usernameOrEmail', (req, res) => {
  const { usernameOrEmail } = req.params;
  const { fullName, age, email, gender } = req.body;
  const users = JSON.parse(fs.readFileSync('./database/users.json'));
  let userIndex = users.findIndex(user => user.username === usernameOrEmail || user.email === usernameOrEmail);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  const updatedUser = { ...users[userIndex], fullName, age, email, gender };
  users[userIndex] = updatedUser;
  fs.writeFileSync('./database/users.json', JSON.stringify(users, null, 2));
  res.status(200).json(updatedUser);
});
router.delete('/:usernameOrEmail', (req, res) => {
  const { usernameOrEmail } = req.params;
  const users = JSON.parse(fs.readFileSync('./database/users.json'));

  const updatedUsers = users.filter(user => user.username !== usernameOrEmail && user.email !== usernameOrEmail);
  if (updatedUsers.length === users.length) {
    return res.status(404).json({ message: 'User not found' });
  }
  fs.writeFileSync('./database/users.json', JSON.stringify(updatedUsers, null, 2));
  res.status(200).json({ message: 'User deleted' });
});
module.exports = router;