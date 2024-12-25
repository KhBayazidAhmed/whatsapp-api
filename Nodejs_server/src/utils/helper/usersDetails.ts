import { User } from "../../db/user.model.js";
import { Request, Response } from "express";
export async function getUsersDetails(req: Request, res: Response) {
  const id = req.params.id;
  if (id) {
    const user = await User.findById(id, { password: 0 });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
    return;
  }
  const users = await User.find({}, { password: 0 });
  res.status(200).json(users);
}
