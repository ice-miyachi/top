// lib/notion.ts
import { Client } from "@notionhq/client";

// Notion クライアントを作成
export const notion = new Client({
  auth: process.env.NOTION_TOKEN, // ← 環境変数に設定したトークンを参照
});