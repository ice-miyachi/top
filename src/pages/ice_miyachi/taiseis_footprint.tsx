import Head from "next/head";
import { useEffect, useState } from "react";

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 画面幅でスマホ判定
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
      {/* ページ本体 */}
    </>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";

import React from "react";

export default function TaiseisFootprint() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
     <iframe
  src="https://dynamic-noodle-39f.notion.site/ebd//2b7c89ce71ed8093a67ed3df59c57eb5"
  width="100%"
  height="600"
  frameBorder={0}
  allowFullScreen
/>
    </div>
  );
}