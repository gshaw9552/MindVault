import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const parts = (authHeader as string).split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Invalid authorization format" });
    return;
  }
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === "object" && "id" in decoded) {
      req.userId = (decoded as JwtPayload).id;
      next();
    } else {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
