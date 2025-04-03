import React, { useEffect, useState } from 'react';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // Fetch initial blogs
        fetch('https://biomedwaste.net/blogs')
            .then(response => response.json())
            .then(data => setBlogs(data));

        // Set up WebSocket connection
        const ws = new WebSocket('ws://biomedwaste.net/');

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            alert(message);
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
