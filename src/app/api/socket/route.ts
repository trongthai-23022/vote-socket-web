import { Server } from "socket.io";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest, res: NextResponse) {
  const socketServer = res as any;

  if (socketServer && socketServer.server && !socketServer.server.io) {
    const io = new Server(socketServer.server);
    if (socketServer) {
      (socketServer as any).server.io = io;
    }

    io.on("connection", (socket) => {
      // Lắng nghe sự kiện vote từ client
      socket.on("vote", (voteData) => {
        // Phát lại kết quả vote cho tất cả các client
        io.emit("updateVote", voteData);
      });

      socket.on("disconnect", () => {});
    });
  } else {
    console.log(
      "Socket.IO server already initialized or socket server not available."
    );
  }

  socketServer.end();
  return Response.json(
    { message: "Socket server setup complete" },
    { status: 200 }
  );
}
