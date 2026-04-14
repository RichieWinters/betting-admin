module.exports = {
  apps: [
    {
      name: 'betting-admin',
      script: 'server.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
