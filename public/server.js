const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());

const apiKey = process.env.WEATHER_API;
const PORT = process.env.PORT || 5000;

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: "City not found" });
  }
});

app.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({ error: "Failed to search cities" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
