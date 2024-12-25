import { Request, Response } from "express";
import { User } from "../../db/user.model.js";

export default async function editUser(req: Request, res: Response) {
  try {
    const { name, whatsAppNumber, price, id, balance } = req.body;

    // Validate required fields
    if (!id || !name || !whatsAppNumber || !price || !balance) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    // Validate price (ensure it is a positive number)
    if (price <= 0) {
      res.status(400).json({ message: "Price must be greater than 0." });
      return;
    }

    // Find and update user by _id
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        whatsAppNumber,
        price,
        balance,
      },
      {
        new: true,
        select: "-password", // exclude the password field
      } // return the updated document
    );

    // If user is not found
    if (!updatedUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Return success response with the updated user data
    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
}
