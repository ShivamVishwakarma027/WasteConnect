import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    wasteType: {
      type: String,
      enum: [
        "Newspaper",
        "Cardboard",
        "Plastic",
        "E-Waste",
        "Metal",
        "Glass",
        "Other",
      ],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, enum: ["kg", "items", "bags"], default: "kg" },
    address: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      default: "Pending",
    },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Pickup", pickupSchema);
