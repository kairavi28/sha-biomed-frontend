import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Biomed Waste Communication Channel
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [autoReload, setAutoReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false); 
  const [blogForm, setBlogForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  // Fetch Blogs
  useEffect(() => {
      fetchBlogs();

  }, []);

  const fetchBlogs = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/blogs")
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load blogs. Please try again.");
        setLoading(false);
      });
  };

  // Handle Blog Form Change
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open Create/Edit Dialog
  const openBlogDialog = (blog = null) => {
    if (blog) {
      setEditMode(true);
      setBlogForm({
        title: blog.title,
        description: blog.description,
        image: blog.image,
      });
    } else {
      setEditMode(false);
      setBlogForm({ title: "", description: "", image: "" });
    }
    setSelectedBlog(blog);
    setOpen(true);
  };

  // Submit Blog (Create or Edit)
  const handleBlogSubmit = () => {
    const endpoint = selectedBlog
      ? `http://localhost:5000/api/blogs/${selectedBlog._id}`
      : "http://localhost:5000/api/blogs";
    const method = selectedBlog ? "put" : "post";

    axios[method](endpoint, blogForm)
      .then(() => {
        alert(`Blog ${selectedBlog ? "updated" : "created"} successfully!`);
        setOpen(false);
        setSelectedBlog(null);
        fetchBlogs();
      })
      .catch(() => {
        alert("Error saving the blog. Please try again.");
      });
  };

  // Delete Blog
  const deleteBlog = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      axios
        .delete(`http://localhost:5000/api/blogs/${blogId}`)
        .then(() => {
          alert("Blog deleted successfully!");
          fetchBlogs();
        })
        .catch(() => {
          alert("Error deleting the blog. Please try again.");
        });
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#f3f4f6" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#f8d7da" }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f9f9f9", minHeight: "100vh", pb: 4 }}>
      <Container>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Admin Blog Management
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 4 }}
          onClick={() => openBlogDialog()}
        >
          Create New Blog
        </Button>
        <Grid container spacing={4}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  {blog.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {blog.description}
                </Typography>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    marginBottom: "16px",
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => openBlogDialog(blog)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteBlog(blog.id)}
                >
                  Delete
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Create/Edit Blog Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editMode ? "Edit Blog" : "Create New Blog"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={blogForm.title}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            variant="outlined"
            value={blogForm.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            multiline
            rows={4}
          />
          <TextField
            name="image"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={blogForm.image}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBlogSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BlogPage;
