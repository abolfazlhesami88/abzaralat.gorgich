export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'toolstore_super_secret_key_2024',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'toolstore_refresh_secret_key_2024',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
});
