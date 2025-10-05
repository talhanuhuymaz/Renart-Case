const express = require("express");
const cors = require("cors");
const axios = require("axios");
const products = require("./products.json");

const app = express();

// CORS ayarları - tüm origin'lere izin ver
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

async function getGoldPrice() {
  // Try multiple APIs for better reliability

  // Option 1: Try MetalpriceAPI (no key needed, free)
  try {
    const res = await axios.get(
      "https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU"
    );
    if (res.data && res.data.rates && res.data.rates.XAU) {
      // XAU is price per troy ounce, convert to grams
      // 1 troy ounce = 31.1035 grams
      const pricePerOunce = 1 / res.data.rates.XAU; // Convert rate to price
      const pricePerGram = pricePerOunce / 31.1035;
      console.log("MetalpriceAPI - Gold price per gram:", pricePerGram);
      return pricePerGram;
    }
  } catch (err) {
    console.error("MetalpriceAPI error:", err.message);
  }

  // Option 2: Try GoldAPI if env key is set
  if (process.env.GOLD_API_KEY) {
    try {
      const res = await axios.get("https://www.goldapi.io/api/XAU/USD", {
        headers: {
          "x-access-token": process.env.GOLD_API_KEY,
          "Content-Type": "application/json",
        },
      });
      const priceUsd = Number(res.data.price_gram_24k);
      if (!isNaN(priceUsd)) {
        console.log("GoldAPI - Gold price per gram:", priceUsd);
        return priceUsd;
      }
    } catch (err) {
      console.error("GoldAPI error:", err.message);
    }
  }

  // Fallback: Gerçekçi gram başına 24k altın fiyatı (USD)
  console.log("Using fallback gold price: $75/gram");
  return 75; // ~$75/gram güncel piyasa fiyatı
}

// Root endpoint - API info
app.get("/", (req, res) => {
  res.json({
    message: "Renart Case Backend API",
    version: "1.0.0",
    endpoints: {
      products: "/products - Get all products with calculated prices",
    },
    goldPriceSource:
      "MetalpriceAPI (primary) → GoldAPI (secondary) → Fallback ($75/g)",
    status: "running",
  });
});

app.get("/products", async (req, res) => {
  const goldPrice = await getGoldPrice();

  const result = products.map((p) => {
    const price = (p.popularityScore + 1) * p.weight * goldPrice;

    return {
      ...p,
      price,
      popularityOutOf5: p.popularityScore * 5,
    };
  });

  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
