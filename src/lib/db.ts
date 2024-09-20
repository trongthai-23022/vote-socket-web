import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Mở kết nối tới cơ sở dữ liệu SQLite
export async function openDB() {
  return open({
    filename: "./voting.db", // Đây là tệp cơ sở dữ liệu SQLite
    driver: sqlite3.Database,
  });
}
