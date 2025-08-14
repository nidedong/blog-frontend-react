/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_SSL: boolean;
  readonly VITE_API_BASEURL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
