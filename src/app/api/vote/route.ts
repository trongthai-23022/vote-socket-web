import { openDB } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

// Khởi tạo Pusher client
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Bật debug mode cho Pusher
// Lưu ý: Pusher không còn hỗ trợ config trực tiếp

async function readStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      result += decoder.decode(value, { stream: !done });
    }
  }

  return result;
}

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { message: "Request body is missing" },
      { status: 400 }
    );
  }
  const body = await readStream(req.body);
  const { optionId } = JSON.parse(body);
  const db = await openDB();

  console.log("Đang xử lý vote cho optionId:", optionId);

  // Cập nhật số lượng vote cho lựa chọn
  await db.run(`UPDATE options SET votes = votes + 1 WHERE id = ?`, [optionId]);
  console.log("Đã cập nhật votes trong database");

  // Lấy thông tin vote mới nhất
  const vote = await db.get(
    `
    SELECT v.*, o.* 
    FROM votes v
    JOIN options o ON o.vote_id = v.id 
    WHERE o.id = ?
  `,
    [optionId]
  );

  console.log("Dữ liệu vote mới:", vote);

  try {
    // Gửi event qua Pusher
    await pusher.trigger("voting-channel", "vote-updated", vote);
    console.log("Đã gửi event tới Pusher thành công");
  } catch (error) {
    console.error("Lỗi khi gửi event tới Pusher:", error);
  }

  return NextResponse.json({ message: "Vote updated" }, { status: 200 });
}
