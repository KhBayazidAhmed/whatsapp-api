import { User } from "../../db/user.model.js";

// Function to check and add a user if no users exist
const addAdmin = async () => {
  try {
    // Check if there are any users in the database
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      // If no users, create a new user
      const newUser = new User({
        name: "admin",
        whatsAppNumber: "8801889961255@c.us",
        password: "SecurePass123!", // Use a secure password in a real application
        role: "admin",
        balance: 100,
        price: 5,
      });

      // Save the user to the database
      await newUser.save();
      console.log("Default user created successfully!");
    } else {
      console.log("Users already exist in the database.");
    }
  } catch (error) {
    console.error("Error checking or adding user:", error);
  }
};
export default addAdmin;
