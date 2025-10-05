const express = require("express");
const cors = require("cors");
const axios = require("axios");
const products = require("./products.json");

const app = express();
app.use(cors());

async function getGoldPrice() {
  try {
    const res = await axios.get("https://www.goldapi.io/api/XAU/USD", {
      headers: {
        "x-access-token": "goldapi-1cbghsmg95f5lh-io",
        "Content-Type": "application/json",
      },
    });

    console.log("GoldAPI response:", res.data);

    const priceUsd = Number(res.data.price_gram_24k);
    if (isNaN(priceUsd)) throw new Error("Invalid price from API");

    return priceUsd;
  } catch (err) {
    console.error("Gold price fetch error:", err.message);
    return 3.4;
  }
}

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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
