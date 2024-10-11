import { NextRequest, NextResponse } from "next/server";
import { openDB } from "../../lib/db";
import { validate as isUuid } from "uuid";

export async function GET(req: NextRequest, res: NextResponse) {
  const id = req.nextUrl.searchParams.get("id");

  if (!isUuid(id as string)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const db = await openDB();

  // Lấy thông tin cuộc vote
  //SELECT * FROM votes WHERE id = 4fe31dac-4799-410d-b823-aa666f3b3108
  const vote = await db.get(`SELECT * FROM votes WHERE id = ?`, [id]);

  if (vote) {
    // Lấy các lựa chọn của cuộc vote
    const options = await db.all(`SELECT * FROM options WHERE vote_id = ?`, [
      id,
    ]);
    return NextResponse.json({ ...vote, options }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Vote not found" });
  }
}
