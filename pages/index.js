import { useState } from "react";
import { IDKitWidget } from "@worldcoin/idkit";


export default function Home() {
  const [verified, setVerified] = useState(false);

  if (verified) {
    return (
      <div className="container">
        <div className="card">
          <h1>Tu recuerdo está listo 📸</h1>
          <a href="/get">
            <button>DESCARGAR</button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Selfie Mirror</h1>
        <p>Verificá tu identidad para continuar</p>

        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID}
          action="selfie-mirror-access"
          onSuccess={async (result) => {
            const r = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(result),
            });
            if (r.ok) setVerified(true);
          }}
        >
          {({ open }) => (
            <button onClick={open}>Verificar con World ID</button>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
}
