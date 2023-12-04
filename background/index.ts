import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import * as path from 'path';

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, '../out'),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.maximize();

  if (app.isPackaged) {
    if (appServe) {
      appServe(win).then(() => {
        win.loadURL('app://-');
      });
    }
  } else {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
    win.webContents.on('did-fail-load', () => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
