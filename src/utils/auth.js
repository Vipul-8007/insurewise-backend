import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
  } catch {
    return null;
  }
};
