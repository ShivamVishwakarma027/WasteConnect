import express from "express";
import Pickup from "../models/Pickup.js";
import User from "../models/User.js";
import { auth, role } from "../middleware/auth.js";

const router = express.Router();
const calcPoints = (quantity, type) =>
  Math.max(
    5,
    Math.round(
      quantity *
        ({
          "E-Waste": 12,
          Plastic: 8,
          Metal: 10,
          Cardboard: 5,
          Newspaper: 5,
          Glass: 6,
          Other: 4,
        }[type] || 4),
    ),
  );

router.post("/", auth, role("user"), async (req, res) => {
  try {
    const { wasteType, quantity, unit, address, pickupDate, notes } = req.body;
    if (!wasteType ||  !quantity ||  !address || !pickupDate)
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    const points = calcPoints(Number(quantity), wasteType);
    const pickup = await Pickup.create({
      user: req.user._id,
      wasteType,
      quantity,
      unit,
      address,
      pickupDate,
      notes,
      points,
    });
    res.status(201).json(pickup);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/mine", auth, role("user"), async (req, res) => {
  const items = await Pickup.find({ user: req.user._id })
    .populate("collector", "name email")
    .sort({ createdAt: -1 });
  res.json(items);
});

router.get("/available", auth, role("collector"), async (req, res) => {
  const items = await Pickup.find({ status: "Pending" })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(items);
});

router.get("/collector", auth, role("collector"), async (req, res) => {
  const items = await Pickup.find({ collector: req.user._id })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(items);
});

router.patch("/:id/accept", auth, role("collector"), async (req, res) => {
  const pickup = await Pickup.findOneAndUpdate(
    { _id: req.params.id, status: "Pending" },
    { status: "Accepted", collector: req.user._id },
    { new: true },
  ).populate("user", "name email");
  if (!pickup)
    return res.status(409).json({ message: "Request is no longer available" });
  res.json(pickup);
});

router.patch("/:id/complete", auth, role("collector"), async (req, res) => {
  const pickup = await Pickup.findOne({
    _id: req.params.id,
    collector: req.user._id,
    status: "Accepted",
  });
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  pickup.status = "Completed";
  await pickup.save();
  await User.findByIdAndUpdate(pickup.user, {
    $inc: { points: pickup.points },
  });
  res.json(pickup);
});

export default router;
