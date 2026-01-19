import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/auth.js";
import { Query } from "mongoose";
import Application from "../models/Application.js";
import { calculatePremium } from "../utils/premiumCalculator.js";

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return User.findById(user.id);
    },

    myApplication: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Application.find({ userID: user.id });
    },
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = generateToken(user);

      return { token, user };
    },

    createApplication: async (_, { input }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const basePremium = calculatePremium(input);

      const application = await Application.create({
        userID: user.id,
        ...input,
        basePremium,
        finalPremium: basePremium,
      });
      return application;
    },
  },
};

export default resolvers;
