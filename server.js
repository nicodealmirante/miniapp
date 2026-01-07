import express from "express";
import fetch from "node-fetch";
import { verifyCloudProof } from "@worldcoin/minikit-js";

const app = express();
app.use(express.json());
app.use(express.static(".")); // sirve index.html

// 🔴 ENV
const APP_ID = "app_feaec177b55a0c5379ad8a2c149f5429";
const DEV_API_KEY = "api_a2V5X2ViNDdiMzJkN2RhZjlkYzQyMGMyYzUwMDIyOWJiN2Q4OnNrXzdhYjUzM2RlOWMyYTMyNTgyNmViYzBkY2NiNzVmMjA5NzE5ZjgwMTc5NjI1MjRhMg";

// VERIFY ID
app.post("/api/verify", async (req, res) => {
  try {
    const { payload, action } = req.body;
    const result = await verifyCloudProof(payload, APP_ID, action);
    return res.json({ success: result.success });
  } catch (e) {
    console.error(e);
    res.json({ success:false });
  }
});

// INIT PAYMENT
app.post("/api/initiate-payment", (_, res) => {
  const reference = crypto.randomUUID().replace(/-/g,"");
  // acá deberías guardarlo en DB
  res.json({ reference });
});

// CONFIRM PAYMENT
app.post("/api/confirm-payment", async (req, res) => {
  try {
    const { transaction_id, reference } = req.body;

    const r = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${transaction_id}?app_id=${APP_ID}`,
      {
        headers: { Authorization:`Bearer ${DEV_API_KEY}` }
      }
    );
    const j = await r.json();

    const ok = j.reference === reference && j.status !== "failed";
    res.json({ success: ok });

  } catch(e) {
    console.error(e);
    res.json({ success:false });
  }
});

app.listen(3000, ()=>console.log("http://localhost:3000"));
