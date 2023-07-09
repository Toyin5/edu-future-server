import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const StudentSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        id: {
          type: Schema.Types.UUID,
          default: () => randomUUID(),
        },
        completed: {
          type: Boolean,
          default: false,
        },
        lastChapter: {
          id: {
            type: Number,
            default: 1,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

export default model("students", StudentSchema);
