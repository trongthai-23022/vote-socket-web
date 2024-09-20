import { NextApiRequest, NextApiResponse } from "next";
import { openDB } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const db = await openDB();

  // Lấy thông tin cuộc vote
  const vote = await db.get(`SELECT * FROM votes WHERE id = ?`, [id]);

  if (vote) {
    // Lấy các lựa chọn của cuộc vote
    const options = await db.all(`SELECT * FROM options WHERE vote_id = ?`, [
      id,
    ]);
    res.status(200).json({ ...vote, options });
  } else {
    res.status(404).json({ message: "Vote not found" });
  }
}
