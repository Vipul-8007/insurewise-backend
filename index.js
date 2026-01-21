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

/* ✅ CORS – Azure + Local + Prod safe */
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://insurewise.vercel.app",
      ];

      // allow requests with no origin (Azure health check, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
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

    /* ✅ Azure health check */
    app.get("/", (req, res) => {
      res.status(200).send("InsureWise Backend is running 🚀");
    });

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();
