// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// --- Cost Model ---
function getCostPerSqft(finishingType) {
  const types = {
    basic: 2500,
    standard: 4000,
    luxury: 6000,
  };
  return types[finishingType] || 3000; // default
}

app.post("/estimate", (req, res) => {
  const { area, floors, finishingType } = req.body;

  // Validate input
  if (!area || !floors || !finishingType) {
    return res.status(400).json({
      error: "Missing required fields (area, floors, finishingType)"
    });
  }

  // Calculate cost
  const costPerSqft = getCostPerSqft(finishingType);
  let baseCost = area * costPerSqft;

  // Extra cost for extra floors
  if (floors > 1) {
    baseCost += baseCost * 0.10 * (floors - 1);
  }

  // Final JSON response
  res.json({
    area,
    floors,
    finishingType,
    costPerSqft,
    estimatedBudget: Math.round(baseCost),
    currency: "LKR",
    message: "Construction cost calculated successfully"
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
