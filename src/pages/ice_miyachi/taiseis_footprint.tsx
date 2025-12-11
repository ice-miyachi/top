import Head from "next/head";
import React from "react";


export default function TaiseisFootprint() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div
        style={{
          width: "100vw",
          height: "100dvh",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <div
          style={{
            transform: "scale(1)",
            transformOrigin: "top center",
            width: "100%",
          }}
        >
          <iframe
            src="https://dynamic-noodle-39f.notion.site/ebd//2b7c89ce71ed8093a67ed3df59c57eb5"
            style={{
              width: "100%",
              height: "1200px",
              border: "none",
              display: "block",
            }}
            scrolling="yes"
          />
        </div>
      </div>
    </>
  );
}
