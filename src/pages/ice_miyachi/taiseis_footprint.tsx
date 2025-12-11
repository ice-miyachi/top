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
          margin: 0,
          padding: 0,
          width: "100vw",
          height: "100vh",   // ← vhで画面全体を確保
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://dynamic-noodle-39f.notion.site/2b7c89ce71ed8093a67ed3df59c57eb5?embed=true"
          style={{
            width: "100%",
            height: "100%",   // ← 親要素に合わせる
            border: "none",
            display: "block",
          }}
          scrolling="yes"
        />
      </div>
    </>
  );
}
