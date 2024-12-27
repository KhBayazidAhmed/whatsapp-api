import mongoose from "mongoose";
const balanceTransitionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to a User model
    required: true,
  },
  type: {
    type: String,
    enum: ["recharge", "debit"], // 'recharge' for adding balance, 'debit' for subtracting balance
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
});

const BalanceTransition = mongoose.model(
  "BalanceTransition",
  balanceTransitionSchema
);

export default BalanceTransition;
