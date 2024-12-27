import { Message } from "whatsapp-web.js";
import NIDData from "../../db/nid.model.js";
import { User } from "../../db/user.model.js";
import logger from "../logger.js";

// Helper function to format numbers to 2 decimal places
const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

// Helper function to build the profile message
const buildProfileMessage = (
  name: string,
  balance: number,
  price: number,
  todayTotalNidMake: number
): string => {
  return `
*Profile Details for ${name}:*

💳 *Current Balance*: ${formatCurrency(balance)} Taka  
💵 *Price*: ${formatCurrency(price)} Taka  
📊 *NID Created Today*: ${todayTotalNidMake}  

If you need further assistance, feel free to ask! 😊
  `;
};

export async function getProfileDetails(msg: Message) {
  try {
    const user = await User.findOne({ whatsAppNumber: msg.from }).exec();

    if (!user) {
      logger.warn(
        `[GetProfileDetails] User not found with WhatsApp number: ${msg.from}`
      );
      await msg.reply(
        "Sorry, we couldn't find your profile details. Please try again later."
      );
      return;
    }

    // Fetch NID data count for today
    const todayTotalNidMake = await NIDData.countDocuments({
      user: user._id,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    // Construct and send the profile message
    const profileMessage = buildProfileMessage(
      user.name,
      user.balance,
      user.price,
      todayTotalNidMake
    );

    await msg.reply(profileMessage);
  } catch (error) {
    logger.error(
      `[GetProfileDetails] Error fetching details for user with WhatsApp number: ${msg.from}`,
      error
    );
    await msg.reply(
      "An error occurred while fetching your profile details. Please try again later."
    );
  }
}
