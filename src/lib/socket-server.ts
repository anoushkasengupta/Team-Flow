import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: IOServer | null = null;

export function initSocket(httpServer: HTTPServer) {
  if (!io) {
    console.log("Initializing Socket.IO server");
    io = new IOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      // Notify others when a user connects
      io!.emit('userConnected', { userId: socket.id });

      // Listen for task assignment
      socket.on('taskAssigned', (data) => {
        console.log('Task assigned event received:', data);
        io?.emit('taskAssigned', data);
      });

      // Listen for task updates
      socket.on('taskUpdated', (data) => {
        console.log('Task updated event received:', data);
        io?.emit('taskUpdated', data);
      });
      
      // Listen for team member added
      socket.on('teamMemberAdded', (data) => {
        console.log('Team member added event received:', data);
        io?.emit('teamMemberAdded', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        io?.emit('userDisconnected', { userId: socket.id });
      });
    });
  }
  return io;
}

export function getIO() {
  if (!io) {
    console.error('Socket.io not initialized! Make sure to call initSocket first.');
    throw new Error('Socket.io not initialized!');
  }
  return io;
} 