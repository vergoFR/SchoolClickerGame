const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 950,
    minWidth: 600,
    minHeight: 700,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save Game',
          accelerator: 'Ctrl+S',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-save');
          }
        },
        {
          label: 'Load Game',
          accelerator: 'Ctrl+O',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-load');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Ctrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Ctrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Ctrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'Ctrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'Ctrl+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Ctrl+R', click: () => { if (mainWindow) mainWindow.reload(); } },
        { label: 'Toggle Developer Tools', accelerator: 'Ctrl+Shift+I', click: () => { if (mainWindow) mainWindow.webContents.toggleDevTools(); } },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'Ctrl+0', click: () => { if (mainWindow) mainWindow.webContents.setZoomLevel(0); } },
        { label: 'Zoom In', accelerator: 'Ctrl+Plus', click: () => { if (mainWindow) mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 1); } },
        { label: 'Zoom Out', accelerator: 'Ctrl+-', click: () => { if (mainWindow) mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 1); } }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About School Clicker',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About School Clicker',
              message: 'School Clicker v1.0.0',
              detail: 'An iOS 26-inspired liquid glass clicker game.\nBuilt with Electron.\n\nSave your progress as JSON files.\nWorks entirely offline.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC: Native save dialog
ipcMain.handle('save-game', async (event, saveData) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'school-clicker-save.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (result.canceled) return { success: false, canceled: true };

    fs.writeFileSync(result.filePath, JSON.stringify(saveData, null, 2));
    return { success: true, path: result.filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC: Native load dialog
ipcMain.handle('load-game', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      defaultPath: app.getPath('documents'),
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf8');
    const saveData = JSON.parse(content);

    return { success: true, data: saveData, path: filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});