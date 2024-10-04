const express = require("express");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const { rateLimit } = require("express-rate-limit");

dotenv.config({ path: ".env" });

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get("/", (req, res) => {
    res.send("Weather api is up and running!");
});

app.get("/weather", async (req, res) => {
    const { location } = req.query;

    if (!location)
        return res.status(400).json({
            status: "fail",
            message: "Please provide a location query parameter!",
        });

    try {
        const url = `${BASE_URL}/${location}?key=${process.env.VISUAL_CROSSING_API_KEY}&unitGroup=metric`;
        const response = await axios.get(url);

        const weatherData = response.data;
        res.json({ status: "success", data: weatherData });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message || "Something went wrong!" });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
