const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  maxHttpBufferSize: 1e8
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Rooms storage: roomCode -> { phone: socketId, dashboard: socketId }
const rooms = new Map();

// Generate a random 6-digit room code
function generateRoomCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(code));
  return code;
}

io.on('connection', (socket) => {
  console.log(`[+] Conectado: ${socket.id}`);

  // Phone creates a room
  socket.on('create-room', (callback) => {
    const code = generateRoomCode();
    rooms.set(code, { phone: socket.id, dashboard: null });
    socket.join(code);
    socket.roomCode = code;
    socket.role = 'phone';
    console.log(`[ROOM] Sala creada: ${code} por celular ${socket.id}`);
    callback({ success: true, roomCode: code });
  });

  // Dashboard joins a room
  socket.on('join-room', (roomCode, callback) => {
    const room = rooms.get(roomCode);
    if (!room) {
      callback({ success: false, error: 'Código de sala no encontrado' });
      return;
    }
    if (room.dashboard) {
      callback({ success: false, error: 'Ya hay un dashboard conectado a esta sala' });
      return;
    }
    room.dashboard = socket.id;
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.role = 'dashboard';
    console.log(`[ROOM] Dashboard ${socket.id} unido a sala: ${roomCode}`);
    callback({ success: true });

    // Notify phone that dashboard is ready
    io.to(room.phone).emit('dashboard-connected');
  });

  // WebRTC signaling
  socket.on('offer', (data) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const target = socket.role === 'phone' ? room.dashboard : room.phone;
    if (target) {
      io.to(target).emit('offer', data);
    }
  });

  socket.on('answer', (data) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const target = socket.role === 'phone' ? room.dashboard : room.phone;
    if (target) {
      io.to(target).emit('answer', data);
    }
  });

  socket.on('ice-candidate', (data) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const target = socket.role === 'phone' ? room.dashboard : room.phone;
    if (target) {
      io.to(target).emit('ice-candidate', data);
    }
  });

  // Camera switch notification
  socket.on('camera-switched', (data) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    if (room.dashboard) {
      io.to(room.dashboard).emit('camera-switched', data);
    }
  });

  // Renegotiation request
  socket.on('renegotiate', () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const target = socket.role === 'phone' ? room.dashboard : room.phone;
    if (target) {
      io.to(target).emit('renegotiate');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[-] Desconectado: ${socket.id}`);
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        if (socket.role === 'phone') {
          // Notify dashboard that phone disconnected
          if (room.dashboard) {
            io.to(room.dashboard).emit('phone-disconnected');
          }
          rooms.delete(socket.roomCode);
          console.log(`[ROOM] Sala eliminada: ${socket.roomCode}`);
        } else if (socket.role === 'dashboard') {
          room.dashboard = null;
          io.to(room.phone).emit('dashboard-disconnected');
          console.log(`[ROOM] Dashboard salió de sala: ${socket.roomCode}`);
        }
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║         📷 PhoneCam Server Running           ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Puerto: ${PORT}                              ║`);
  console.log('╠══════════════════════════════════════════════╣');

  // Show local IPs
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`║  Red local: http://${iface.address}:${PORT}`);
      }
    }
  }

  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  Para acceso remoto, despliega en Render.com ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});
