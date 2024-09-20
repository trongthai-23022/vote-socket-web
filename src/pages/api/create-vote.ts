import { NextApiRequest, NextApiResponse } from "next";
import { openDB } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, options } = req.body;
    const db = await openDB();

    // Lưu thông tin cuộc vote
    const result = await db.run(`INSERT INTO votes (title) VALUES (?)`, [
      title,
    ]);
    const voteId = result.lastID;

    // Lưu các lựa chọn của cuộc vote
    const optionInsertPromises = options.map((option: string) =>
      db.run(`INSERT INTO options (vote_id, option) VALUES (?, ?)`, [
        voteId,
        option,
      ])
    );
    await Promise.all(optionInsertPromises);

    res.status(200).json({ id: voteId });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
