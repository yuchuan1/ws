import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface CPUData {
  timestamp: string;
  cpuUsage: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  public cpuData = signal<CPUData[]>([]);
  private wsUrl = environment.wsUrl || 'ws://localhost:8080';

  connect(): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(this.wsUrl);

    this.ws.onmessage = (event) => {
      const newData = JSON.parse(event.data) as CPUData;
      this.cpuData.update(current => {
        const updated = [...current, newData];
        return updated.slice(-50);
      });
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      setTimeout(() => {
        this.connect();
      }, 1000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
} 