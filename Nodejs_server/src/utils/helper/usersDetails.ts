import { User } from "../../db/user.model.js";
import { Request, Response } from "express";
import logger from "../logger.js";

export async function getUsersDetails(req: Request, res: Response) {
  const id = req.params.id;

  try {
    if (id) {
      // Attempt to find a single user by ID
      const user = await User.findById(id, { password: 0 });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(user);
      return;
    }

    // Fetch all users
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    // Log error when fetching user details
    logger.error(
      "[GetUsersDetails] Error occurred while fetching user details.",
      { error }
    );
    res.status(500).json({ message: "Internal server error" });
  }
}
