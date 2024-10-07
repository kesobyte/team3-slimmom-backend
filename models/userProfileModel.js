import { Schema, model } from "mongoose";

const userProfileSchema = new Schema(
    {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        height: {  // Correcting the field name
          type: Number,
          required: [true],
        },
        dWeight: {
          type: Number,
          required: [true],
        },
        age: {
          type: Number,
          required: [true],
        },
        bloodType: {
          type: Number,
          required: [true],
        },
        cWeight: {
            type: Number,
            required: [true],
        },
        dailyCalories: {
            type: Number,
        }
      },
      { versionKey: false }
);

const Profile = model("profile", userProfileSchema);

export { Profile };
