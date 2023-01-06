declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATA_BASE_LOCAL_URL: string;
      DATA_BASE_URL: string;
      SECRET_KEY: string;
    }
  }
}

export {}