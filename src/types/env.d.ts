declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_URL: string;
    REDIS_TLS?: string;
  }
}
