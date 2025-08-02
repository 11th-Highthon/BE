import { Request, Response } from "express";
import User from "../schemas/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * @swagger
 * /users/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 description: The ID of the user to follow.
 *     responses:
 *       200:
 *         description: Followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Followed successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., cannot follow self, already following)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You cannot follow yourself
 *       401:
 *         description: Unauthorized (e.g., no token, invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
export const followUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const { targetUserId } = req.body;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

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

    if (!user || !targetUser)
      return res.status(404).json({ message: "User not found" });

    if (user.following.includes(targetUserId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    (user.following as mongoose.Types.ObjectId[]).push(targetUser._id);
    (targetUser.followers as mongoose.Types.ObjectId[]).push(user._id);
    await user.save();
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Followed successfully", user: targetUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /users/unfollow:
 *   post:
 *     summary: Unfollow a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 description: The ID of the user to unfollow.
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unfollowed successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (e.g., no token, invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
export const unfollowUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const { targetUserId } = req.body;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

    let userId: string;
    try {
        const decoded =jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if(!user || !targetUser) return res.status(404).json({ message: "User not found" });

        user.following = user.following.filter(userId => userId.toString() !== targetUserId.toString());
        targetUser.followers = targetUser.followers.filter(userId => userId.toString() !== user._id.toString());

        await user.save();
        await targetUser.save();

        return res.status(200).json({ message: "Unfollowed successfully", user: targetUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
