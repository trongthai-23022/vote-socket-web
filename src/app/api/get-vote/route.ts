import { NextApiRequest, NextApiResponse } from "next";
import { openDB } from "../../lib/db";
import { validate as isUuid } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!isUuid(id as string)) {
    return res.status(400).json({ message: "Invalid ID format" });
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
    res.status(200).json({ ...vote, options });
  } else {
    res.status(404).json({ message: "Vote not found" });
  }
}
