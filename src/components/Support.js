import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
} from "@mui/material";

function Issues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then((response) => response.json())
      .then((data) => {
        setIssues(data);
      })
      .catch((err) => console.error("Error fetching issues:", err));
  }, []);

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #e0f7fa, #b2ebf2)",
        minHeight: "100vh",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: 4,
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
          py: 4,
          px: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{
            mb: 4,
            color: "#333",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          Issues Dashboard
        </Typography>
        <Grid container spacing={4}>
          {issues.map((issue, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  maxWidth: 345,
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={issue.image}
                  alt="Issue Image"
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <CardContent
                  sx={{
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    fontWeight="bold"
                    sx={{ mb: 1, color: "#00796b" }}
                  >
                    {issue.facility}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      height: "50px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {issue.complaintDescription}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "#757575" }}
                  >
                    {new Date(issue.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      background: "linear-gradient(to right, #00796b, #48a999)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(to right, #00574b, #327e67)",
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Issues;
