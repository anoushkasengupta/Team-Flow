import { Server as IOServer } from 'socket.io';
import { NextApiResponse } from 'next';

// Socket server instance
let ioInstance: IOServer | null = null;

/**
 * This function initializes socket.io server for the Next.js Pages Router
 * Since Next.js has no built-in support for socket.io, we need to manually 
 * attach it to the server instance
 */
export default function initializeSocket(res: NextApiResponse): IOServer {
  // Use any to safely access the socket/server properties
  const socketRes = res as any;
  
  if (!socketRes.socket || !socketRes.socket.server) {
    throw new Error('No server found in socket response');
  }
  
  // If socket.io instance already exists, return it
  if (socketRes.socket.server.io) {
    console.log('Reusing existing Socket.io server instance');
    return socketRes.socket.server.io;
  }
  
  console.log('**** Initializing new Socket.io server instance ****');
  
  try {
    // Create new socket.io instance and save it on the server
    const io = new IOServer(socketRes.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Set up listeners
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      
      // Join a user-specific room for targeted notifications
      socket.on('authenticate', (userId: string) => {
        console.log(`User ${userId} authenticated and joined room`);
        socket.join(`user-${userId}`);
      });
      
      // Listen for team-related events
      socket.on('teamMemberAdded', (data) => {
        console.log('Team member added event:', data);
        // Emit to the specific user who was added to the team
        if (data.userId) {
          io.to(`user-${data.userId}`).emit('teamMemberAdded', data);
        }
      });
      
      // Listen for task-related events
      socket.on('taskAssigned', (data) => {
        console.log('Task assigned event:', data);
        // Emit to the specific user who was assigned the task
        if (data.assignedTo) {
          io.to(`user-${data.assignedTo}`).emit('taskAssigned', data);
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Save io instance on the server
    socketRes.socket.server.io = io;
    ioInstance = io;
    
    return io;
  } catch (error) {
    console.error('Failed to initialize Socket.io server:', error);
    throw error;
  }
}

// Export a function to safely get the IO instance
export function getIOInstance(): IOServer {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized! Make sure to call initSocket first.');
  }
  return ioInstance;
} 