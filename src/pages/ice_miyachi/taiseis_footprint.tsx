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
      {/* Notion 埋め込み */}
      <iframe
        src="https://dynamic-noodle-39f.notion.site/2b7c89ce71ed8093a67ed3df59c57eb5?pvs=4"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}