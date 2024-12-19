import { openDB } from "@/app/lib/db";

export async function GET() {
  const db = await openDB();

  // Tạo bảng votes để lưu thông tin cuộc vote
  await db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL
    )
  `);

  // Tạo bảng options để lưu các tùy chọn cho mỗi cuộc vote
  await db.exec(`
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vote_id INTEGER,
      option TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      FOREIGN KEY (vote_id) REFERENCES votes(id)
    )
  `);

  return Response.json({ message: "Database setup complete" }, { status: 200 });
}
