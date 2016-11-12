var http        = require('http'),
    cloudcmd    = require('cloudcmd'),
    express     = require('express'),
    io          = require('socket.io'),
    app         = express(),

    PORT        = 1337,

    server,
    socket;

server = http.createServer(app);
socket = io.listen(server);

app.use(cloudcmd({
    socket: socket,     /* used by Config, Edit (optional) and Console (required)   */
    config: {           /* config data (optional)                                   */
        prefix: '/cloudcmd', /* base URL or function which returns base URL (optional)   */
    }
}));

server.listen(PORT);

