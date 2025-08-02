import { Request, Response } from "express";
import User from "../schemas/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const followUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const { targetUserId } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (userId === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if(!user || !targetUser) return res.status(404).json({ message: "User not found"});

    if(user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "You are already following this user" });
    }
    
    (user.following as mongoose.Types.ObjectId[]).push(targetUser._id);
    (targetUser.followers as mongoose.Types.ObjectId[]).push(user._id);
    await user.save();
    await targetUser.save();

    return res.status(200).json({ message: "Followed successfully", user: targetUser });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

