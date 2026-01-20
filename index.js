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

/* ✅ CORS – Azure + Local dono ke liye */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://insurewise.vercel.app", // future frontend
    ],
    credentials: true,
  }),
);

app.use(express.json());

async function startServer() {
  console.log("Starting backend on Azure...");

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

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start", err);
});
