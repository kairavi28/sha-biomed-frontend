import React from "react";
import {
  Box,
  Container, Typography
} from "@mui/material";
import ContactSlider from "./ContactSlider";

const CallToAction = () => {
  return (
    <Box sx={{ mt: 8, py: 4, background: "rgb(4, 23, 65)", borderRadius: 2 }}>
      <Container sx={{ mt: 1, mb: 1 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#fff", textAlign: "center" }}>Let's Talk!</Typography>
        {/* <Typography variant="body1" sx={{ mb: 3, color: "#fff" }}>
        <b>We value your time and are here to help. Reach out to us directly using the contact details provided, or fill out the quick form, and one of our team members will get back to you as soon as possible</b>
        </Typography> */}
      </Container>

      {/* Button Section */}
      <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-700 transition">
        REQUEST A FREE PROPOSAL
      </button>
      <Container>
        <ContactSlider />
      </Container>
    </Box>
  );
};

export default CallToAction;
