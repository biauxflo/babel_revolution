const app = require('./app');
//const https = require('https');
const http = require('http');
//const fs = require('fs');

/*const server = https.createServer({
    key: fs.readFileSync('certificate/key.pem'),
    cert: fs.readFileSync('certificate/cert.pem')
}, app);*/
const server = http.createServer(app)

const io = require('socket.io')(server);

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

io.on('connection', (socket) => {
    // We get url of the connection request
    const url = socket.handshake.headers.referer;
    // We use a regex to get the '/session/x' (with x a number) in the url, if any
    const sessionId = url.match(/\/session\/\d+/);
    // If the regex is found, the user join the session room
    if (sessionId && sessionId.length === 1) {
        socket.join(sessionId[0]);
    }

    // When there is a change in the graph
    socket.on("databaseUpdate", () => {
        console.log("Database Updated");
        io.emit("databaseUpdate");
    });
    // When a decree is published (emit only to the concerned room)
    socket.on("decreePublished", decreeAndExamples => {
        console.log("Decree is published");
        io.to(sessionId[0]).emit("decreePublished", decreeAndExamples);
    });
    // When a session is completed (emit only to the concerned room)
    socket.on("sessionCompleted", end => {
        console.log("Session is completed");
        io.to(sessionId[0]).emit("sessionCompleted", end);
    });
})

server.listen(port);
