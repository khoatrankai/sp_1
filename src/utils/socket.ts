import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_API_BASE_URL,{
  withCredentials: true,
  transports: ['websocket', 'polling'],
}); // Đổi port theo NestJS backend
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error('Socket chưa được khởi tạo!');
  return socket;
};