import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socketServer = res.socket as any;
  console.log("Socket server:", socketServer);

  if (socketServer && socketServer.server && !socketServer.server.io) {
    console.log("Initializing Socket.IO server...");
    const io = new Server(socketServer.server);
    if (res.socket) {
      (res.socket as any).server.io = io;
    }

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Lắng nghe sự kiện vote từ client
      socket.on("vote", (voteData) => {
        console.log("Received vote data:", voteData);
        // Phát lại kết quả vote cho tất cả các client
        io.emit("updateVote", voteData);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  } else {
    console.log(
      "Socket.IO server already initialized or socket server not available."
    );
  }
  res.end();
}