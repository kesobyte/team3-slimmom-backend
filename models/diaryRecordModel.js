import { Schema, model } from "mongoose";

const diaryRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    date: {
      type: Date,
      required: [true],
    },
    product: {
      type: String,
      required: [true],
    },
    grams: {
      type: Number,
      required: [true],
    },
    calories: {
      type: Number,
      required: [true],
    },
  },
  { versionKey: false }
);

const diaryRecord = model("diaryrecord", diaryRecordSchema);

export { diaryRecord };
