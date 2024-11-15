import * as WebSocket from 'ws';
import * as http from 'http';
import * as osUtils from 'os-utils';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocket.Server({
  server,
  perMessageDeflate: false,
  clientTracking: true
});

wss.on('connection', (ws, req) => {
  console.log(`Client connected from ${req.socket.remoteAddress}`);

  const interval = setInterval(() => {
    osUtils.cpuUsage((value) => {
      const data = {
        timestamp: new Date().toISOString(),
        cpuUsage: value * 100
      };
      ws.send(JSON.stringify(data));
    });
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server started on port ${PORT}`);
});
