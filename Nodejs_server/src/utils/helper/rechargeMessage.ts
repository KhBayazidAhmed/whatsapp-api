import { Message } from "whatsapp-web.js";
import logger from "../logger.js";
import sendMessageToTelegram from "./sendMessageTelegram.js";

export default async function rechargeMessage(msg: Message) {
  try {
    const replyText = `
    *\`ব্যালেন্স এড করার জন্য নিচের নাম্বারে টাকা দেন\`*

*01310587360*
> *Bkash Merchant*: পেমেন্ট অপশনে গিয়ে টাকা পাঠাবেন।
> *নগদ/রকেট*: একই নাম্বারে সেন্ড মানি করুন।

*টাকা পাঠিয়ে স্ক্রিনশট দিন।*

*অটো রিচার্জ চালু করা হবে, কাজ চলমান, একটু সময় দেন সবাই।*
`;
    await msg.reply(replyText);
    sendMessageToTelegram(`[Recharge] requested ${msg.from} for recharge`);
    logger.info(
      "Recharge message sent successfully. for whatsApp number:",
      msg.from
    );
  } catch (error) {
    logger.error(
      "Error sending recharge message. for whatsApp number:",
      msg.from,
      error
    );
  }
}
