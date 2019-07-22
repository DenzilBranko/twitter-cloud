import openSocket from 'socket.io-client';

const ROOT_URL = 'http://localhost:5000';
const  socket = openSocket(ROOT_URL);

function StockUpdate(cb) {
    socket.on('twitterSend', timestamp => cb(null, timestamp));
    socket.emit('twitterEmit', 1000);
}
export { StockUpdate };