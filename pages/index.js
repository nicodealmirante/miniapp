import { IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";
import QRCode from "qrcode.react";

export default function Home() {
  const [status, setStatus] = useState("idle");

  const payURI = `worldapp://pay?to=${process.env.NEXT_PUBLIC_WLD_RECEIVER_WALLET}&amount=${process.env.NEXT_PUBLIC_WLD_AMOUNT}&token=WLD`;

  return (
    <>
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID}
        action={process.env.NEXT_PUBLIC_WORLD_ACTION}
        signal="40wld"
        onSuccess={async (result) => {
          setStatus("verifying");

          const r = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          });

          if (r.ok) setStatus("verified");
          else setStatus("error");
        }}
      >
        {({ open }) => (
          <div className="scene" onClick={status === "idle" ? open : undefined}>
            <div className="sparkles">
              <span></span><span></span><span></span>
            </div>

            <div className="center">
              <img src="/logowld.png" className="logo" />

              {status === "idle" && (
                <div className="text">
                  <span className="welcome">WELCOME</span>
                  <span className="received">Tap to verify</span>
                </div>
              )}

              {status === "verifying" && (
                <div className="text">
                  <span className="received">Verifying…</span>
                </div>
              )}

              {status === "verified" && (
                <>
                  <div className="text">
                    <span className="welcome">PAY TO CONTINUE</span>
                    <span className="received">
                      {process.env.NEXT_PUBLIC_WLD_AMOUNT} WLD
                    </span>
                  </div>

                  <div className="qr">
                    <QRCode value={payURI} size={220} />
                    <p>Scan with World App</p>
                  </div>
                </>
              )}

              {status === "error" && (
                <div className="text">
                  <span className="received">Verification failed</span>
                </div>
              )}
            </div>
          </div>
        )}
      </IDKitWidget>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width:100%; height:100%; overflow:hidden; font-family:Inter,sans-serif; }

        .scene {
          position: relative;
          width: 100%;
          height: 100%;
          background: url("/bg.jpeg") center / cover no-repeat;
        }

        .scene::after {
          content: "";
          position: absolute;
          inset: 0;
          backgro
