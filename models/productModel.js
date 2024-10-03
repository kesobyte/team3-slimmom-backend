import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    categories: {
      type: String,
      required: [true],
    },
    weight: {
      type: Number,
      required: [true],
    },
    title: {
      type: String,
      required: [true],
    },
    calories: {
      type: Number,
      required: [true],
    },
    groupBloodNotAllowed: {
      type: Array,
      required: [true],
    },
  },
  { versionKey: false }
);

const Product = model("product", productSchema);

module.exports = { Product };
