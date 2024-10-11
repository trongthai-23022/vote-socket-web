import { Server as IOServer, Socket } from "socket.io";
import { NextRequest, NextResponse } from "next/server";
import { Server as HttpServer } from "http";
import { initializeSocketServer } from "@/sockerServer";

interface SocketServer extends HttpServer {
  io?: IOServer;
}

interface SocketWithServer {
  socket: {
    server: SocketServer;
  };
}

export async function GET(req: NextRequest, res: any) {
  const socketWithServer = res as SocketWithServer;

  // Kiểm tra nếu socket server có sẵn
  if (!socketWithServer.socket?.server) {
    // Khởi tạo server nếu chưa có
    socketWithServer.socket = {
      server: new HttpServer(),
    };
  }

  const { socket } = socketWithServer;

  initializeSocketServer(socket.server);

  return NextResponse.json(
    { message: "Socket server setup complete" },
    { status: 200 }
  );
}
