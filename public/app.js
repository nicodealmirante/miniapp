const verifyPayload = {
  action: "wld-airdrop",
  signal: "session-1",
};

const out = document.getElementById("out");

document.getElementById("verify").onclick = async () => {
  if (!window.MiniKit || !MiniKit.isInstalled()) {
    alert("Abrí esto dentro de World App");
    return;
  }

  try {
    const result = await MiniKit.verify(verifyPayload);

    if (result.status === "error") {
      out.textContent = JSON.stringify(result, null, 2);
      return;
    }

    const r = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: result,
        action: verifyPayload.action,
        signal: verifyPayload.signal,
      }),
    });

    out.textContent = JSON.stringify(await r.json(), null, 2);
  } catch (e) {
    out.textContent = e.message;
  }
};
