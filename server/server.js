
const socketIo = require("socket.io");
const http = require("http");
const app = require('./app');
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (client) => {
   client.on('twitterEmit',(interval)=>{
     client.emit('twitterSend','datalist');
   })
 })
 
 
 
 app.use(function(req, res, next) {
   req.io = io;
   next();
 });
 app.io = io
 
server.listen(port,() => {
  console.log(`server is listening on port:${port}`)
})

module.exports = server

