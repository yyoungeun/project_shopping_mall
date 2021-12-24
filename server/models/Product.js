const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: Array,
      default: [],
    },
    sold: {
      // 얼마나 팔렸는지
      type: Number,
      maxlength: 100,
      default: 0,
    },
    continents: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    name: "text",
    description: "text",
  },
  {
    // control search result with weight
    weights: 5, // name중요
    description: 1, // default 1(생략 가능)
  }
);
const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
