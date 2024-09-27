import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/app/lib/db";
import { v4 as uuidv4 } from "uuid";

// Helper function to read stream
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
  const { title, options } = JSON.parse(body);
  const db = await openDB();
  const voteId = uuidv4();

  try {
    // Lưu thông tin cuộc vote
    await db.run(`INSERT INTO votes (id, title) VALUES (?, ?)`, [
      voteId,
      title,
    ]);

    // Lưu các lựa chọn của cuộc vote
    const optionInsertPromises = options.map((option: string) =>
      db.run(`INSERT INTO options (vote_id, option) VALUES (?, ?)`, [
        voteId,
        option,
      ])
    );
    await Promise.all(optionInsertPromises);

    return NextResponse.json(
      { message: "Vote created", voteId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
