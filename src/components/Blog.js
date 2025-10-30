import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Paper } from '@mui/material';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

    useEffect(() => {
        fetch(`${API_BASE_URL}/blogs`)
            .then((res) => res.json())
            .then((data) => setBlogs(data))
            .catch((err) => console.error(err));

        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws = new WebSocket(`${wsProtocol}://biomedwaste.net/api/`);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'NEW_BLOG') {
                setBlogs((prev) => [message.data, ...prev]);
            }
        };

        return () => ws.close();
    }, [API_BASE_URL]); // ✅ Add API_BASE_URL here

    return (
        <Box
            sx={{
                minHeight: '100vh',
                p: 4,
                backgroundColor: '#f4f6f8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom>
                Blog List
            </Typography>

            <Paper
                sx={{
                    width: '100%',
                    maxWidth: 800,
                    p: 2,
                    backgroundColor: '#fff',
                }}
            >
                <List>
                    {blogs.length === 0 && (
                        <ListItem>
                            <Typography>No blogs available.</Typography>
                        </ListItem>
                    )}
                    {blogs.map((blog) => (
                        <ListItem key={blog._id} divider>
                            <Typography variant="h6">{blog.title}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default Blog;
