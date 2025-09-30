// server.js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Xin chào từ Node.js server!");
});

server.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});
