// PM2 ecosystem configuration
// Usage: pm2 start pm2.config.js

module.exports = {
  apps: [
    {
      name: 'qualiseg-backend',
      script: './dist/server.js',
      cwd: '/var/www/qualiseg-backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/qualiseg-backend-error.log',
      out_file: '/var/log/pm2/qualiseg-backend-out.log',
      log_file: '/var/log/pm2/qualiseg-backend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};

