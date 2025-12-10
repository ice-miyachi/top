// src/pages/ice_miyachi/index.tsx
import Link from 'next/link';
import HomePage from "./ice_miyachi";

export default HomePage;

export default function Home() {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* 雑誌検索ページへのリンク */}
      <Link href="/ice_miyachi/Ae_magazine2023" style={cardStyle}>
        <h2>Aぇ! group掲載雑誌一覧 2023</h2>
        <p>雑誌情報を検索できます</p>
      </Link>

      {/* もうひとつの検索画面（仮） */}
      <Link href="/ice_miyachi/another_search" style={cardStyle}>
        <h2>別の検索画面</h2>
        <p>別のデータを検索</p>
      </Link>
    </div>
  );
}

// シンプルなカード風スタイル
const cardStyle: React.CSSProperties = {
  display: 'block',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  textDecoration: 'none',
  color: 'black',
  width: '250px',
  boxShadow: '2px 2px 6px rgba(0,0,0,0.1)',
};