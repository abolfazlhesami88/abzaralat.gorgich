function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.length < 32) {
    throw new Error(`متغیر محیطی ${key} تنظیم نشده یا کوتاهتر از حد امن (۳۲ کاراکتر) است.`);
  }
  return value;
}

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'), // FIX [Pillar 3 — Security]: Removed hardcoded JWT secret fallback
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'), // FIX [Pillar 3 — Security]: Removed hardcoded JWT refresh secret fallback
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
});
