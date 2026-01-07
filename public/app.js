// === CONFIG IDKIT ===
const APP_ID = "app_feaec177b55a0c5379ad8a2c149f5429"; // TU APP ID REAL
const ACTION = "wldairdrop";           // MISMA action del portal
const SIGNAL = "session-1";             // opcional

// Inicializar IDKit
MiniKit.configure({
  app_id: APP_ID,
});
const verifyPayload = {
  action: "wldairdrop",
  signal: "session-1",
};

document.getElementById("verify").onclick = async () => {
  if (!window.MiniKit?.isInstalled()) {
    alert("Open this inside World App");
    return;
  }
console.log("MiniKit:", window.MiniKit);
alert("MiniKit installed? " + window.MiniKit?.isInstalled());

  const { finalPayload } =
    await MiniKit.commandsAsync.verify(verifyPayload);

  if (finalPayload.status === "error") {
    out.textContent = JSON.stringify(finalPayload, null, 2);
    return;
  }

  const r = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payload: finalPayload,
      action: verifyPayload.action,
      signal: verifyPayload.signal,
    }),
  });

  out.textContent = JSON.stringify(await r.json(), null, 2);
};
