type Listener = (msg: any) => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private listeners: Listener[] = [];
  private isConnected = false;

  public connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/ws`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('[TWINSPHERE WS] Connected to backend real-time stream.');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        } catch (e) {
          console.warn('[TWINSPHERE WS] Error parsing message:', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log('[TWINSPHERE WS] Disconnected. Reconnecting in 3s...');
        setTimeout(() => this.connect(), 3000);
      };

      this.socket.onerror = (err) => {
        console.warn('[TWINSPHERE WS] Error:', err);
      };
    } catch (e) {
      console.warn('[TWINSPHERE WS] Failed to initialize websocket:', e);
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const wsClient = new WebSocketClient();
