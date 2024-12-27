import { Request, Response } from "express";
import NIDData from "../../db/nid.model.js";
import { User } from "../../db/user.model.js";
import BalanceTransition from "../../db/BalanceTransition.model.js";

export const homeAnalytics = async (req: Request, res: Response) => {
  try {
    // Get Today's Date Range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query for today's total sell
    const totalSell = await NIDData.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalSell: { $sum: "$price" }, // Assuming `price` represents the sell value
        },
      },
    ])
      .then((result) => result[0]?.totalSell || 0)
      .catch((err) => {
        console.error("Error fetching total sell:", err);
        return 0;
      });

    // Query for total balance across users
    const totalBalance = await User.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$balance" },
        },
      },
    ])
      .then((result) => result[0]?.totalBalance || 0)
      .catch((err) => {
        console.error("Error fetching total balance:", err);
        return 0;
      });
    const totalAddedBalance = await BalanceTransition.aggregate([
      {
        $match: {
          transactionDate: { $gte: startOfDay, $lte: endOfDay }, // Match on 'transactionDate' field
          type: "recharge", // Ensure you're summing only 'recharge' transactions
        },
      },
      {
        $group: {
          _id: null,
          totalAddedBalance: { $sum: "$amount" },
        },
      },
    ]);

    // Count total NID entries for today
    const totalNID = await NIDData.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).catch((err) => {
      console.error("Error fetching total NID count:", err);
      return 0;
    });
    console.log("total added balance", totalAddedBalance);
    // Send response
    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: [
        {
          title: "Total Added Balance",
          value: `${totalAddedBalance[0]?.totalAddedBalance.toFixed(2)}`,
        },
        {
          title: "Total Balance",
          value: `${totalBalance.toFixed(2)}`,
        },
        {
          title: "Today Total Sell",
          value: `${totalSell.toFixed(2)}`,
        },

        {
          title: "Today  Total NID",
          value: `${totalNID.toString()}`,
        },
      ],
    });
  } catch (error: any) {
    console.error("Error in homeAnalytics:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
