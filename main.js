const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');

let mainWindow;
let browserView;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Add a BrowserView for the webpage content
  browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.setBrowserView(browserView);

  // Set initial bounds for the BrowserView
  browserView.setBounds({ x: 0, y: 50, width: 800, height: 550 });
  browserView.setAutoResize({ width: true, height: true });

  // Load the webpage content
  browserView.webContents.loadURL('http://localhost:3000/eeze');

  // Load the UI controls in the main window
  mainWindow.loadFile('index.html');

  // Handle opacity changes from renderer
  ipcMain.on('update-opacity', (event, opacity) => {
    mainWindow.setOpacity(opacity);
  });

  // Handle content transparency updates
  ipcMain.on('update-content-opacity', (event, opacity) => {
    browserView.webContents.executeJavaScript(`
      document.body.style.opacity = '${opacity}';
    `);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});