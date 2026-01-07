import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===== ENDPOINT WORLD ID VERIFY ===== */
app.post("/api/verify", async (req, res) => {
  const { payload, action, signal } = req.body;

  const r = await fetch(
    "https://developer.worldcoin.org/api/v1/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WORLDCOIN_API_KEY}`,
      },
      body: JSON.stringify({
        ...payload,
        action,
        signal,
      }),
    }
  );

  const data = await r.json();

  if (!data.success) {
    return res.status(400).json(data);
  }

  // 👉 acá después podés:
  // - guardar nullifier_hash
  // - habilitar depósito
  // - iniciar countdown

  res.json({ success: true });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("✅ Backend running on port", PORT)
);
