import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Change this URL to your server's URL if needed
const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : '';

async function fetchUserId() {
  // Try to get userId from localStorage first
  let userId = localStorage.getItem('userId');
  if (userId) return userId;
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      const data = await res.json();
      userId = data.user?.id || data.user?._id;
      if (userId) {
        localStorage.setItem('userId', userId);
        return userId;
      }
    }
  } catch (e) {
    console.error('Failed to fetch userId:', e);
  }
  return null;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    // If a socket already exists, no need to reconnect
    if (socketRef.current?.connected) {
      console.log('Using existing socket connection:', socketRef.current.id);
      return;
    }

    const connectSocket = async () => {
      try {
        console.log('Connecting to Socket.IO server at:', SOCKET_URL);
        // Connect to Socket.IO server
        const socket = io(SOCKET_URL, {
          autoConnect: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          path: '/api/socket',
          addTrailingSlash: false,
        });

        // Setup event handlers
        socket.on('connect', async () => {
          console.log('Socket connected successfully with ID:', socket.id);
          // Always fetch userId and authenticate
          const userId = await fetchUserId();
          if (userId) {
            socket.emit('authenticate', userId);
            console.log(`Authenticated with user ID: ${userId}`);
          }
          socketRef.current = socket;
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message);
          // Retry logic
          if (connectionAttempts < maxRetries) {
            setConnectionAttempts((prev) => prev + 1);
            console.log(`Retrying connection (${connectionAttempts + 1}/${maxRetries})...`);
            setTimeout(connectSocket, 2000); // Retry after 2 seconds
          } else {
            console.error('Max connection attempts reached. Giving up.');
          }
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // The disconnection was initiated by the server, reconnect manually
            socket.connect();
          }
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        // Save the socket reference
        socketRef.current = socket;
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    // Initialize the connection
    connectSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectionAttempts]);

  return socketRef.current;
} 