function initializeServers(serverConfigs: ServerConfig[]) {
    serverConfigs.forEach(config => {
        startServer(config);
    });
}

function startServer(config: ServerConfig) {
    // Server initialization logic
}