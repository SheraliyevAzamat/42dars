const express = require('node:express')
const bodyParser = require('body-parser');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use('/register', userRoutes);
app.use('/login', userRoutes);
app.use('/profile', userRoutes);
app.use('/blog', blogRoutes);
app.listen(port, () => {
  console.log(`Server http://localhost:4000`);
});