// src/pages/ice_miyachi/taiseis_footprint.tsx
import Head from "next/head";
import React, { useEffect, useState } from "react";

export default function TaiseisFootprint() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content={
            isMobile
              ? "width=device-width, initial-scale=0.5"
              : "width=device-width, initial-scale=1"
          }
        />
      </Head>

      <div
        style={{
          margin: 0,
          padding: 0,
          width: "100vw",
          height: "100vh", 
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://dynamic-noodle-39f.notion.site/ebd//2b7c89ce71ed8093a67ed3df59c57eb5"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </>
  );
}