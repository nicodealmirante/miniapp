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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: Inter, system-ui, sans-serif;
        }

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
          background: linear-gradient(
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.35)
          );
        }

        .sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sparkles span {
          position: absolute;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 4s infinite;
        }

        .sparkles span:nth-child(1) {
          top: 30%;
          left: 20%;
        }

        .sparkles span:nth-child(2) {
          top: 50%;
          left: 70%;
          animation-delay: 1.2s;
        }

        .sparkles span:nth-child(3) {
          top: 65%;
          left: 40%;
          animation-delay: 2.4s;
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          40% {
            opacity: 0.8;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }

        .center {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .logo {
          width: 90px;
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }

        .text {
          margin-top: 32px;
          color: #000;
        }

        .welcome {
          font-size: 14px;
          letter-spacing: 3px;
          opacity: 0.6;
        }

        .received {
          font-size: 20px;
          margin-top: 8px;
        }

        .qr {
          margin-top: 24px;
          background: #fff;
          padding: 16px;
          border-radius: 12px;
        }
      `}</style>
    </>
  );
}
