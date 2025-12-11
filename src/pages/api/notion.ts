// src/pages/api/notion.ts
import { notion } from "@/lib/notion";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID; // 環境変数で設定したデータベースID
    const response = await notion.databases.query({
      database_id: databaseId!,
    });

    res.status(200).json(response.results);
  } catch (error) {
    console.error("Notion API error:", error);
    res.status(500).json({ error: "Failed to fetch Notion data" });
  }
}