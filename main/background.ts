import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import '../backend/server';
import { machineIdSync } from 'node-machine-id';

const isProd = process.env.NODE_ENV === 'production';

const ip = machineIdSync(true);

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
   if (1) {
    await app.whenReady();

    const mainWindow = createWindow('main', {
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    mainWindow.maximize();

    if (isProd) {
      await mainWindow.loadURL('app://./login');
    } else {
      const port = process.argv[2];
      await mainWindow.loadURL(`http://localhost:${port}/products`);
      mainWindow.webContents.openDevTools();
    }
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});
