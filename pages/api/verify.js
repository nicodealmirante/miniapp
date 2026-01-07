export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const r = await fetch("https://api.worldcoin.org/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WORLDCOIN_API_KEY}`,
      },
      body: JSON.stringify({
        ...req.body,
        action: process.env.NEXT_PUBLIC_WORLD_ACTION,
      }),
    });

    const data = await r.json();

    if (!data.success) {
      return res.status(400).json(data);
    }

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "verify_error" });
  }
}
