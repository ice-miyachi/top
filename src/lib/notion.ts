// lib/notion.ts
import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN, // ← Vercelに追加したトークンを使う
});
