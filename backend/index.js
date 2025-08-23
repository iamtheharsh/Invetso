// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const { HoldingsModel } = require("./model/HoldingsModel");

// const { PositionsModel } = require("./model/PositionsModel");
// const { OrdersModel } = require("./model/OrdersModel");

// const PORT = process.env.PORT || 3002;
// const uri = process.env.MONGO_URL;

// const authRoutes = require("./routes/auth");
// const passport = require("passport");
// const session = require("express-session");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.use(session({ secret: "secretkey", resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/auth", authRoutes);


// app.get("/allHoldings", async (req, res) => {
//     let allHoldings = await HoldingsModel.find({})  ;
//     res.json(allHoldings);
//   });

// app.get("/allPositions", async (req, res) => {
//   let allPositions = await PositionsModel.find({});
//   res.json(allPositions);
// });

// app.post("/newOrder", async (req, res) => {
//   let newOrder = new OrdersModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//   });

//   newOrder.save();

//   res.send("Order saved!");
// });

// app.listen(PORT, () => {
//   console.log("App started!");
//   mongoose.connect(uri);
//   console.log("DB started!");
// });

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// === READ endpoints ===
app.get("/allHoldings", async (_req, res) => {
  try {
    const all = await HoldingsModel.find({}).lean();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (_req, res) => {
  try {
    const all = await PositionsModel.find({}).lean();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.get("/allOrders", async (_req, res) => {
  try {
    const all = await OrdersModel.find({}).sort({ _id: -1 }).lean();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// === CREATE order + update holdings ===
// Body: { name: string, qty: number, price: number, mode: "BUY" | "SELL" }
app.post("/newOrder", async (req, res) => {
  try {
    let { name, qty, price, mode } = req.body;

    // Basic validation & type coercion
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "name, qty, price, mode are required" });
    }
    qty = Number(qty);
    price = Number(price);
    mode = String(mode).toUpperCase();
    if (!Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price <= 0) {
      return res.status(400).json({ message: "qty and price must be positive numbers" });
    }
    if (mode !== "BUY" && mode !== "SELL") {
      return res.status(400).json({ message: "mode must be BUY or SELL" });
    }

    // 1) Save the order
    const order = await OrdersModel.create({ name, qty, price, mode });

    // 2) Update holdings
    let holding = await HoldingsModel.findOne({ name });

    if (mode === "BUY") {
      if (holding) {
        const currentQty = Number(holding.qty || 0);
        const currentAvg = Number(holding.avg || 0);

        const totalCost = currentQty * currentAvg + qty * price;
        const newQty = currentQty + qty;
        const newAvg = newQty === 0 ? 0 : totalCost / newQty;

        holding.qty = newQty;
        holding.avg = Number(newAvg.toFixed(2));
        holding.price = price; // latest known price from the order
        // optional simple net/day strings (UI computes P&L itself)
        holding.net = "";
        holding.day = "";
      } else {
        holding = new HoldingsModel({
          name,
          qty,
          avg: Number(price.toFixed(2)),
          price,
          net: "",
          day: "",
        });
      }
      await holding.save();
    } else if (mode === "SELL") {
      if (!holding) {
        return res.status(400).json({ message: "Cannot sell a holding that does not exist" });
      }
      const currentQty = Number(holding.qty || 0);
      if (qty > currentQty) {
        return res.status(400).json({ message: "Not enough quantity to sell" });
      }
      const newQty = currentQty - qty;
      holding.qty = newQty;
      holding.price = price; // latest known price
      if (newQty === 0) {
        await holding.deleteOne();
        return res.json({ message: "Order placed, holding removed", order });
      } else {
        await holding.save();
      }
    }

    res.json({ message: "Order placed & holdings updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// Start server & DB
app.listen(PORT, async () => {
  console.log("App starting...");
  try {
    await mongoose.connect(MONGO_URL, { autoIndex: true });
    console.log("Mongo connected");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
  console.log("Listening on port", PORT);
});
