const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || ""; // Get the connection string from the environment variable

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/**
 * Creates a new MongoClient instance with the specified connection string and options.
 * 
 * @constant {MongoClient} client - The MongoClient instance used to connect to the MongoDB server.
 * @param {string} connectionString - The connection string for the MongoDB server.
 * @param {object} options - The options for the MongoClient.
 * @param {object} options.serverApi - The server API version and settings.
 * @param {string} options.serverApi.version - The version of the server API to use.
 * @param {boolean} options.serverApi.strict - Enables strict mode for the server API.
 * @param {boolean} options.serverApi.deprecationErrors - Enables deprecation errors for the server API.
 */
const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let conn; // Declare a variable to hold the connection object
try {
  conn = await client.connect(); // Connect to the MongoDB cluster
  console.log("mongo connected"); // Log a message
} catch (e) {
  console.error(e); // Log an error if unable to connect
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
