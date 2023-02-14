const config = require('./config');
const server = require('./server');

const port = config.port || 3000;

server.listen(port, () => console.log('Server is runing on port: ' + port));