// src/pages/ice_miyachi/Ae_magazine2023.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import styles from '../../styles/Ae_magazine.module.css';
import { Analytics } from "@vercel/analytics/next"
import Head from "next/head";




const membersList = ['末澤', '草間', '正門', '小島', '福本', '佐野','全員','不明'];




export default function MagazineSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

 

  // データ取得

   useEffect(() => {
    
    const fetchData = async () => {
      let query = supabase.from('magazines').select('*',{ count: 'exact' });

      if (title) {
        query = query.ilike('title', `%${title}%`);
      }

      if (selectedMembers.length > 0) {
        query = query.contains('members', selectedMembers); // Supabaseの配列検索
      }

      if (startDate && endDate) {
        query = query.gte('release_date', startDate).lte('release_date', endDate);
      }
      // ✅ 並び順を反映（ここに書く）
      query = query.order('release_date', { ascending: sortOrder === 'asc' });


      // ページネーション: 50件ずつ
      const from = page * 50;
      const to = from + 49;
      

      
      const { data, error ,count} = await query.range(from, to);



      if (error) {
        console.error(error);
      } else {
        setResults(data || []);
        setTotalCount(count || 0);
      }
    };
    

    fetchData();
  }, [title, selectedMembers, startDate, endDate, page, sortOrder]);

  // ページ番号リセット用 useEffect
  useEffect(() => {
  setPage(0); // 検索条件が変わったら常に1ページ目に戻す
  }, [title, selectedMembers, startDate, endDate]);

  const totalPages = Math.ceil(totalCount / 50);

// Excel 出力関数
const exportToExcel = () => {
  if (selectedRows.length === 0) {
    alert('出力する行を選択してください');
    return;
  }

  const data = selectedRows.map((row) => ({
    発売日: row.release_date,
    タイトル: row.title,
    掲載者: row.members?.join(', '),
    備考: row.notes || '',
    表紙: row.is_cover ? '✔' : '',
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Magazines');
  XLSX.writeFile(workbook, 'magazines.xlsx');
};


// PDF 出力関数
const exportToPDF = () => {
  if (selectedRows.length === 0) {
    alert('出力する行を選択してください');
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('掲載雑誌一覧', 14, 20);

  const tableData = selectedRows.map((row) => [
    row.release_date,
    row.title,
    row.members?.join(', '),
    row.notes || '',
    row.is_cover ? '✔' : '',
  ]);

  autoTable(doc, {
    head: [['発売日', 'タイトル', '掲載者', '備考', '表紙']],
    body: tableData,
    startY: 30,
  });

  doc.save('magazines.pdf');
};

const exportToImage = async () => {
  if (selectedRows.length === 0) {
    alert('出力する行を選択してください');
    return;
  }

  // 出力用のテーブルを一時的に作成
  const table = document.createElement('table');
  table.style.display = 'none';
  table.border = '1';
  const header = table.insertRow();
  ['発売日', 'タイトル', '掲載者', '備考', '表紙'].forEach(text => {
    const cell = header.insertCell();
    cell.innerText = text;
  });

  selectedRows.forEach(row => {
    const tr = table.insertRow();
    tr.insertCell().innerText = row.release_date;
    tr.insertCell().innerText = row.title;
    tr.insertCell().innerText = row.members?.join(', ') || '';
    tr.insertCell().innerText = row.notes || '';
    tr.insertCell().innerText = row.is_cover ? '✔' : '';
  });

  document.body.appendChild(table);

  // テーブルを画像化
  const canvas = await html2canvas(table);
  const imgData = canvas.toDataURL('image/png');

  // ダウンロードリンクを作成
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'magazines.png';
  link.click();

  document.body.removeChild(table);
};

const selectAllPages = async () => {
  const { data, error } = await supabase
    .from('magazines')
    .select('*'); // ページ指定なしで全件取得

  if (error) {
    console.error(error);
    return;
  }
  setSelectedRows(data || []);
};

const clearAllPages = () => {
  setSelectedRows([]);
};

const selectAllMatching = async () => {
  let query = supabase.from('magazines').select('*');

  if (title) query = query.ilike('title', `%${title}%`);
  if (selectedMembers.length > 0) query = query.contains('members', selectedMembers);
  if (startDate && endDate) query = query.gte('release_date', startDate).lte('release_date', endDate);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return;
  }

  if (data.length > 999) {
    alert(`チェックは最大999件までです（現在 ${data.length} 件）`);
    return;
  }

  setSelectedRows(data || []);
};

const clearAllMatching = () => {
  setSelectedRows([]);
};


async function downloadAllAsExcel() {

  let countQuery = supabase.from('magazines').select('*', { count: 'exact', head: true });
  if (title) countQuery = countQuery.ilike('title', `%${title}%`);
  if (selectedMembers.length > 0) countQuery = countQuery.contains('members', selectedMembers);
  if (startDate && endDate) countQuery = countQuery.gte('release_date', startDate).lte('release_date', endDate);

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error(countError);
    return;
  }
  const pageSize = 1000;
  let allData: any[] = [];


  // 1000件ずつ取得
  for (let from = 0; from < (count || 0); from += pageSize) {
    let dataQuery = supabase.from('magazines').select('*');
    if (title) dataQuery = dataQuery.ilike('title', `%${title}%`);
    if (selectedMembers.length > 0) dataQuery = dataQuery.contains('members', selectedMembers);
    if (startDate && endDate) dataQuery = dataQuery.gte('release_date', startDate).lte('release_date', endDate);

    // ソート順を反映
    dataQuery = dataQuery.order('release_date', { ascending: sortOrder === 'asc' });

    const to = from + pageSize - 1;
    const { data, error } = await dataQuery.range(from, to);
    if (error) {
      console.error(error);
      break;
    }
    allData = allData.concat(data || []);

  }

  // Excel出力
  const excelData = allData.map((row) => ({
    発売日: row.release_date,
    タイトル: row.title,
    掲載者: row.members?.join(', '),
    備考: row.notes || '',
    表紙: row.is_cover ? '✔' : '',
  }));
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Magazines');
  XLSX.writeFile(workbook, 'magazines_all.xlsx');
};



const downloadAllAsImage = async () => {
  let countQuery = supabase.from('magazines').select('*', { count: 'exact', head: true });
  if (title) countQuery = countQuery.ilike('title', `%${title}%`);
  if (selectedMembers.length > 0) countQuery = countQuery.contains('members', selectedMembers);
  if (startDate && endDate) countQuery = countQuery.gte('release_date', startDate).lte('release_date', endDate);

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error(countError);
    return;
  }

  const pageSize = 1000;
  let allData: any[] = [];


  // 1000件ずつ取得
  for (let from = 0; from < (count || 0); from += pageSize) {
    let dataQuery = supabase.from('magazines').select('*');
    if (title) dataQuery = dataQuery.ilike('title', `%${title}%`);
    if (selectedMembers.length > 0) dataQuery = dataQuery.contains('members', selectedMembers);
    if (startDate && endDate) dataQuery = dataQuery.gte('release_date', startDate).lte('release_date', endDate);

    // ソート順を反映
    dataQuery = dataQuery.order('release_date', { ascending: sortOrder === 'asc' });

    const to = from + pageSize - 1;
    const { data, error } = await dataQuery.range(from, to);
    if (error) {
      console.error(error);
      break;
    }
    allData = allData.concat(data || []);

  }

  // 出力用のテーブルを一時的に作成
  const table = document.createElement('table');
  table.style.display = 'none';
  table.border = '1';
  const header = table.insertRow();
  ['発売日', 'タイトル', '掲載者', '備考', '表紙'].forEach(text => {
    const cell = header.insertCell();
    cell.innerText = text;

  });

  allData.forEach(row => {
    const tr = table.insertRow();
    tr.insertCell().innerText = row.release_date;
    tr.insertCell().innerText = row.title;
    tr.insertCell().innerText = row.members?.join(', ') || '';
    tr.insertCell().innerText = row.notes || '';
    tr.insertCell().innerText = row.is_cover ? '✔' : '';
  });

  document.body.appendChild(table);

  // テーブルを画像化
  const canvas = await html2canvas(table);
  const imgData = canvas.toDataURL('image/png');

  // ダウンロードリンクを作成
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'magazines_all.png';
  link.click();

  document.body.removeChild(table);
};

// 共通ハンドラ
const runWithLoading = async (fn: () => Promise<void> | void) => {
  setLoading(true);
  try {
    await fn();
  } finally {
    setLoading(false);
  }
};




return (
  <div className={styles.container}>
    <Head>
      <title>Aぇ! group 掲載雑誌検索 23年まで</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    {/* ← ここから通常の画面 */}
    <h1 className={styles.title}> Aぇ! group 掲載雑誌検索 23年まで</h1>
    <p className={styles.subtitle}>雑誌掲載情報を検索・出力できます</p>
    <p className={styles.subtitle}>データは23年までのものでインターネットにて拾えた情報のみを掲載しております</p>
    <p className={styles.subtitle}>すべてを網羅しているわけではありませんのでご了承ください</p>
    <p className={styles.subtitle}>24年に発売された6人の雑誌も含まれておりません</p>
    <p className={styles.subtitle}>チェックボックスにチェックを入れたものを一覧にしたExcelファイルを出力できます</p>
    <p className={styles.subtitle}>スマホをご利用の方はGoogleスプレッドシートをご利用いただくと編集やPDF化が出来ます</p>
    <p className={styles.subtitle}>学習用に作ったものなので動作は保証できません。また突然非公開にする可能性があります</p>

    {/* 検索バー */}
    <div className={styles.searchBarWrapper}>
      <input
        type="text"
        placeholder="タイトル検索"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.searchBar}
      />
    </div>

    {/* メンバー検索 */}
    <div>
      {membersList.map((member) => (
        <label key={member} style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            value={member}
            checked={selectedMembers.includes(member)}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedMembers((prev) =>
                checked ? [...prev, member] : prev.filter((m) => m !== member)
              );
            }}
          />
          {member}
        </label>
      ))}
    </div>

    {/* 日付範囲 */}
    <div>
      <label>
        開始日：
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label style={{ marginLeft: "10px" }}>
        終了日：
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
    </div>

    {/* 並び順 */}
    <div style={{ marginTop: "10px" }}>
      <label>
        並び順：
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
          <option value="asc">発売日（古い順）</option>
          <option value="desc">発売日（新しい順）</option>
        </select>
      </label>
    </div>

    {/* 結果 */}
    <main>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <span>
          検索結果件数: {totalCount} 件 ／ チェック済み: {selectedRows.length} 件
        </span>
      </div>

      <div className={styles["table-wrapper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>チェック</th>
              <th>発売日</th>
              <th>タイトル</th>
              <th>掲載者</th>
              <th>備考</th>
              <th>表紙</th>
            </tr>
          </thead>

          <tbody>
            {results.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.some((r) => r.id === row.id)}
                    onChange={(e) => {
                      if (e.target.checked && selectedRows.length >= 999) {
                        alert("チェックは最大999件までです");
                        return;
                      }
                      if (e.target.checked) {
                        setSelectedRows((prev) => [...prev, row]);
                      } else {
                        setSelectedRows((prev) => prev.filter((r) => r.id !== row.id));
                      }
                    }}
                  />
                </td>

                <td>{row.release_date}</td>
                <td>{row.title}</td>
                <td>{row.members?.join(", ")}</td>
                <td>{row.notes || ""}</td>
                <td>{row.is_cover ? "✔" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>

    {/* ボタンエリア */}
    <div className={styles.buttonArea}>
      <div className={styles.buttonGroup}>
        <button className={styles.fancyButton} onClick={() => setSelectedRows(results)}>
          このページをすべてチェック
        </button>
        <button className={styles.fancyButton} onClick={() => setSelectedRows([])}>
          このページのチェックをすべて解除
        </button>
        <button className={styles.fancyButton} onClick={selectAllMatching}>
          検索結果をすべてチェック
        </button>
        <button className={styles.fancyButton} onClick={clearAllMatching}>
          検索結果のチェックをすべて解除
        </button>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.fancyButton} onClick={() => runWithLoading(() => exportToExcel())}>
          チェック済みをExcel出力
        </button>

        <button className={styles.fancyButton} onClick={() => runWithLoading(() => downloadAllAsExcel())}>
          検索結果をすべてExcel出力
        </button>
      </div>
    </div>

    {/* ローディング */}
    {loading && <div className={styles.loading}>Now Loading...</div>}

    {/* ページネーション */}
    <div className={styles.pagination}>
      <span>Page {page + 1} / {totalPages}</span>
      <button className={styles.fancyButton} disabled={page === 0} onClick={() => setPage(0)}>最初へ</button>
      <button className={styles.fancyButton} disabled={page === 0} onClick={() => setPage((p) => p - 1)}>前へ</button>
      <button className={styles.fancyButton} disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>次へ</button>
      <button className={styles.fancyButton} disabled={page + 1 >= totalPages} onClick={() => setPage(totalPages - 1)}>最後へ</button>
    </div>
  </div>
);
}