const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

mongoose.connect(
  "mongodb+srv://tobimartin441:Goodmother1@cluster0.rn975.mongodb.net/"
);
try {
  console.log("Connected to the database");
} catch (error) {
  console.log(error);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: `http://localhost:5173/`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${3000}`);
});
