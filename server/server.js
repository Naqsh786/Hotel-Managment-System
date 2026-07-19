import app from "./app.js";
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({ quiet: true });

const port = process.env.PORT || 7000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for now or define client URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Attach io to app so it can be used in controllers: req.app.get('io')
app.set("io", io);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', ({ userId, role }) => {
    socket.join(userId);
    if (role) {
      socket.join(role.toLowerCase());
    }
    console.log(`User ${userId} joined room ${userId} and ${role ? role.toLowerCase() : ''}`);
  });

  socket.on('send_message', (data) => {
    // data: { senderId, receiverRole, receiverId, message, ... }
    if (data.receiverRole && data.receiverRole !== 'guest') {
      // Sent to a role
      io.to(data.receiverRole).emit('receive_message', data);
    } else if (data.receiverId) {
      // Sent to a specific user
      io.to(data.receiverId).emit('receive_message', data);
    }
  });

  socket.on('mark_read', (data) => {
    // data: { senderId, receiverId, roleOrUserId }
    // Just a basic notification
    io.to(data.senderId).emit('messages_read', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
    console.log(`listening to port ${port}`);
});