import { Schema, model } from "mongoose";

const VerifySchema = new Schema({
  studentId: {
    type: Schema.Types.UUID,
    required: true,
    ref: "users",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    index: { expires: "24h" },
  },
});

export default model("verification", VerifySchema);
