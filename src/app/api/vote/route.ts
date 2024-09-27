import { openDB } from "@/app/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { optionId } = req.body;
  const db = await openDB();

  // Cập nhật số lượng vote cho lựa chọn
  await db.run(`UPDATE options SET votes = votes + 1 WHERE id = ?`, [optionId]);

  res.status(200).json({ message: "Vote updated" });
}

////// Phải dùng hàm xử lí rq trước
