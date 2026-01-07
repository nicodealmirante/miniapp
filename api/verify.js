export default async function handler(req, res) {
  const proof = req.body;

  const verifyRes = await fetch(
    "https://developer.worldcoin.org/api/v1/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WORLDCOIN_API_KEY}`,
      },
      body: JSON.stringify({
        ...proof,
        app_id: process.env.NEXT_PUBLIC_WORLD_APP_ID,
        action: "selfie-mirror-access",
      }),
    }
  );

  const data = await verifyRes.json();

  if (data.success) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
