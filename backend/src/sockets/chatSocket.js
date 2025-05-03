const Match = require('../models/Match');
const Message = require('../models/Message');
const User = require('../models/User');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('join-chat', async (data) => {
      const { matchId, userId } = data;
      
      try {
        // Verificar que el match existe y el usuario es parte de él
        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1: userId },
            { user2: userId }
          ],
          isActive: true
        }).populate('user1 user2', 'email name');

        if (!match) {
          console.log('Match no encontrado o usuario no autorizado');
          socket.emit('error', { message: 'Match no encontrado o no autorizado' });
          return;
        }

        socket.join(matchId);
        console.log(`Usuario ${userId} se unió al chat ${matchId}`);

        // Cargar historial de mensajes
        const messages = await Message.find({ match: matchId })
          .sort({ createdAt: 1 })
          .populate('sender', 'email name')
          .populate('receiver', 'email name');

        socket.emit('chat-history', {
          messages,
          matchInfo: {
            user1: match.user1,
            user2: match.user2
          }
        });
      } catch (error) {
        console.error('Error al unirse al chat:', error);
        socket.emit('error', { message: 'Error al unirse al chat' });
      }
    });

    socket.on('send-message', async (data) => {
      try {
        const { matchId, senderId, content } = data;

        // Verificar que el match existe y el usuario es parte de él
        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1: senderId },
            { user2: senderId }
          ],
          isActive: true
        }).populate('user1 user2', 'email name');

        if (!match) {
          console.log('Match no encontrado o usuario no autorizado');
          socket.emit('error', { message: 'Match no encontrado o no autorizado' });
          return;
        }

        // Determinar el receptor
        const receiverId = match.user1._id.toString() === senderId ? match.user2._id : match.user1._id;

        // Obtener información del emisor y receptor
        const [sender, receiver] = await Promise.all([
          User.findById(senderId).select('email name'),
          User.findById(receiverId).select('email name')
        ]);

        // Crear y guardar el mensaje
        const message = new Message({
          match: matchId,
          sender: senderId,
          receiver: receiverId,
          content
        });
        await message.save();

        // Actualizar el último mensaje en el match
        match.lastMessage = content;
        match.lastMessageAt = new Date();
        await match.save();

        // Emitir el mensaje a todos en la sala
        const messageData = {
          _id: message._id,
          match: matchId,
          sender: {
            _id: sender._id,
            email: sender.email,
            name: sender.name
          },
          receiver: {
            _id: receiver._id,
            email: receiver.email,
            name: receiver.name
          },
          content,
          createdAt: message.createdAt
        };

        io.to(matchId).emit('receive-message', messageData);
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        socket.emit('error', { message: 'Error al enviar mensaje' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};
