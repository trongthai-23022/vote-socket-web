import { openDB } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest, res: NextResponse) {
  if (!req.body) {
    return NextResponse.json(
      { message: "Request body is missing" },
      { status: 400 }
    );
  }
  const body = await readStream(req.body);
  const { optionId } = JSON.parse(body);
  const db = await openDB();

  // Cập nhật số lượng vote cho lựa chọn
  await db.run(`UPDATE options SET votes = votes + 1 WHERE id = ?`, [optionId]);

  return NextResponse.json({ message: "Vote updated" }, { status: 200 });
}
