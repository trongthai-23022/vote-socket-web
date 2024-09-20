import { NextApiRequest, NextApiResponse } from "next";
import { openDB } from "../../lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, options } = req.body;
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

      res.status(200).json({ id: voteId });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
