const express = require('express');
const fs = require('fs');
const router = express.Router();
router.post('/', (req, res) => {
  const { title, slug, content, tags } = req.body;
  const blogs = JSON.parse(fs.readFileSync('./database/blog.json'));
  const newBlog = {
    id: blogs.length + 1,
    title,
    slug,
    content,
    tags,
    comments: []
  };

  blogs.push(newBlog);
  fs.writeFileSync('./database/blog.json', JSON.stringify(blogs, null, 2));

  res.status(201).json(newBlog);
});
router.get('/', (req, res) => {
  const blogs = JSON.parse(fs.readFileSync('./database/blog.json'));
  res.status(200).json(blogs);
});
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, slug, content, tags } = req.body;
  const blogs = JSON.parse(fs.readFileSync('./database/blog.json'));
  let blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
  if (blogIndex === -1) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  const updatedBlog = { ...blogs[blogIndex], title, slug, content, tags };
  blogs[blogIndex] = updatedBlog;
  fs.writeFileSync('./database/blog.json', JSON.stringify(blogs, null, 2));

  res.status(200).json(updatedBlog);
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const blogs = JSON.parse(fs.readFileSync('./database/blog.json'));
  const updatedBlogs = blogs.filter(blog => blog.id !== parseInt(id));
  if (updatedBlogs.length === blogs.length) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  fs.writeFileSync('./database/blog.json', JSON.stringify(updatedBlogs, null, 2));
res.status(200).json({ message: 'Blog deleted' });
});
module.exports = router;