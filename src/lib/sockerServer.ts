import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export function initializeSocketServer(httpServer: HttpServer) {
  if (!io) {
    io = new IOServer(httpServer, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("vote", (voteData) => {
        console.log("Received vote", voteData);

        io?.emit("updateVote", voteData);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    console.log("Socket.IO server initialized.");
  }

  return io;
}
