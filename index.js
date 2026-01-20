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

/* =======================
   CORS (Azure + Local)
======================= */
app.use(
  cors({
    origin: "*", // Azure + local dono ke liye
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

console.log("🚀 App starting on Azure...");

/* =======================
   Apollo Server
======================= */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = getUserFromToken(token);
    return { user };
  },
});

/* =======================
   Start Server (IMPORTANT)
======================= */
async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🚀 GraphQL → /graphql`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
}

startServer();
