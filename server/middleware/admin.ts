import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isAdmin) {
      return next();
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
      : [];

    const isAdminUser =
      adminEmails.includes((user.email || "").toLowerCase()) ||
      process.env.NODE_ENV !== "production";

    if (isAdminUser) {
      if (req.user) req.user.isAdmin = true;
      return next();
    }

    return res.status(403).json({ message: "forbidden" });
  } catch (error) {
    console.error("Admin verification failed:", error);
    return res.status(500).json({ message: "admin verification failed" });
  }
};

export default admin;
