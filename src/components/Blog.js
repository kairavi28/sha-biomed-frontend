import React, { useEffect, useState } from 'react';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // Fetch initial blogs
        fetch('http://localhost:5000/api/blogs')
            .then(response => response.json())
            .then(data => setBlogs(data));

        // Set up WebSocket connection
        const ws = new WebSocket('ws://localhost:5000');

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            alert(message);
            console.log(message);
            if (message.type === 'NEW_BLOG') {
                setBlogs((prevBlogs) => [message.data, ...prevBlogs]);
            }
        };

        return () => ws.close();
    }, []);

    return (
        <div>
            <h1>Blog List</h1>
            <ul>
                {blogs.map(blog => (
                    <li key={blog._id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
