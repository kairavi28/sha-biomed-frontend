import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Grid, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch blog data from the backend
    axios
      .get("http://localhost:5000/api/blogs") 
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load blogs. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f9f9f9", minHeight: "100vh", py: 4 }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
          Blog Page
        </Typography>
        <Grid container spacing={4}>
          {blogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} key={blog.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  backgroundColor: "white",
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.3s",
                  },
                }}
              >
                <Box
                  sx={{
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {blog.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                  {blog.description.slice(0, 100)}... {/* Show a snippet */}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "#888" }}>
                  Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default BlogPage;
