import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="scale-50">
      <Component {...pageProps} />
    </div>
  );
}

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