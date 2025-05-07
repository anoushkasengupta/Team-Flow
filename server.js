import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Handle Socket.IO requests
    if (parsedUrl.pathname === '/api/socket') {
      res.end();
      return;
    }
    
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO with HTTP server
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  // Set up Socket.IO event listeners
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join a user-specific room for targeted notifications
    socket.on('authenticate', (userId) => {
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

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('> Socket.IO server initialized');
  });
}); 