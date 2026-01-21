import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import typeDefs from "./src/schema/typeDefs.js";
import resolvers from "./src/schema/resolvers.js";
import { getUserFromToken } from "./src/utils/auth.js";

dotenv.config();

const app = express();

/* ✅ ROOT ROUTE – Azure health check */
app.get("/", (req, res) => {
  res.status(200).send("InsureWise Backend is running 🚀");
});

/* ✅ CORS – Local + Azure Static Web App */
const allowedOrigins = [
  "http://localhost:5173", //Local dev
  "https://delightful-island-00e825300.4.azurestaticapps.net", // Azure Frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // ❗ don’t crash server
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const token = req.headers.authorization || "";
        const user = getUserFromToken(token);
        return { user };
      },
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();
