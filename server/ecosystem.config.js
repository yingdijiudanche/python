module.exports = {
  apps: [
    {
      name: 'Meta',
      namespace: 'Meta',
      script: './server.js',
      watch: false,
      instance_var: 'INSTANCE_ID',
      env: {
        PORT: 5000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 5000,
        NODE_ENV: 'production',
      },
    },
  ],
};
