<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Selfie Mirror MiniApp</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background:#111;
      color:#fff;
      font-family:system-ui, sans-serif;
      text-align:center;
      padding:20px;
    }
    button {
      padding:14px 22px;
      font-size:16px;
      border-radius:12px;
      border:none;
      margin:10px 0;
      cursor:pointer;
    }
    .ok { background:#00ff99; color:#000; }
    .pay { background:#ffd700; color:#000; }
    .disabled { opacity:.4; pointer-events:none; }
    #log { margin-top:15px; font-size:14px; color:#aaa; }
  </style>
</head>
<body>

  <h2>📸 Selfie Mirror</h2>

  <button id="verifyBtn">Verificar World ID</button>
  <button id="payBtn" class="pay disabled">Pagar</button>
  <button id="startBtn" class="ok disabled">Comenzar experiencia</button>

  <div id="log"></div>

  <script type="module">
    import { MiniKit } from "https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@latest/+esm";

    const verifyBtn = document.getElementById("verifyBtn");
    const payBtn    = document.getElementById("payBtn");
    const startBtn  = document.getElementById("startBtn");
    const log       = document.getElementById("log");

    let verified = false;
    let paid = false;

    const ACTION_ID = "selfie-mirror-verify";
    const RECEIVER_WALLET = "0x1f62e7890d5db2c94c280547876b050f5d1816c5";

    function logMsg(msg) {
      log.innerText = msg;
    }

    // ---------- WORLD ID ----------
    verifyBtn.onclick = async () => {
      try {
        logMsg("Verificando identidad...");

        const { finalPayload } = await MiniKit.commandsAsync.verify({
          action: ACTION_ID,
          signal: "selfie-mirror"
        });

        if (!finalPayload) throw "Verificación cancelada";

        // En producción: enviar esto a tu backend
        console.log("WORLD ID PAYLOAD:", finalPayload);

        verified = true;
        verifyBtn.classList.add("disabled");
        payBtn.classList.remove("disabled");

        logMsg("✅ Identidad verificada");

      } catch (e) {
        logMsg("❌ Error de verificación");
        console.error(e);
      }
    };

    // ---------- PAGO ----------
    payBtn.onclick = async () => {
      try {
        logMsg("Solicitando pago...");

        const payment = await MiniKit.commandsAsync.sendPayment({
          to: RECEIVER_WALLET,
          amount: "40.00",      // USD
          token: "WLD",
          reference: "selfie-mirror"
        });

        if (!payment?.success) throw "Pago cancelado";

        console.log("PAYMENT:", payment);

        paid = true;
        payBtn.classList.add("disabled");
        startBtn.classList.remove("disabled");

        logMsg("💰 Pago confirmado");

      } catch (e) {
        logMsg("❌ Pago cancelado");
        console.error(e);
      }
    };

    // ---------- ACCIÓN FINAL ----------
    startBtn.onclick = () => {
      if (!verified || !paid) return;
      logMsg("🚀 Comenzando experiencia...");
      
      // 👉 ACÁ ARRANCA TU CÁMARA / IA / FOTO
    };

  </script>
</body>
</html>
