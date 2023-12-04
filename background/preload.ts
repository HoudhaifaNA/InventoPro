import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface ElectronAPI {
  on(channel: string, callback: (event: IpcRendererEvent, ...args: any[]) => void): void;
  send(channel: string, args?: any): void;
}

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
} as ElectronAPI);
