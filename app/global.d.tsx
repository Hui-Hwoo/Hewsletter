declare interface Window {
  __TAURI__?: {
    writeText(text: string): Promise<void>;
  };
}