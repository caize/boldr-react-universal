const path = require('path');
const HotServers = require('../webpack/hmr/HotServers');

const ROOT_DIR = path.join(__dirname, '..', '..');
const servers = new HotServers(ROOT_DIR);
servers.start();
