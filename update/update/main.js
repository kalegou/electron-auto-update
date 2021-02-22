// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain} = require('electron')
const regedit = require('regedit');
const path = require('path')
const { autoUpdater } =require("electron-updater");
const package = require('./package.json')
let name = package.productName;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
//开机自启与关闭启动
ipcMain.on('startFun', (e, arg) => {
  console.log(arg)
  console.log(app.getLoginItemSettings().openAtLogin)
  if(arg==app.getLoginItemSettings().openAtLogin) return;
  if(arg){
    app.setLoginItemSettings({
      openAtLogin: arg,
      path: process.execPath
    })
  }else{
    app.setLoginItemSettings({
      openAtLogin: false
    })
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//自动更新
//执行自动更新检查
const feedUrl = `http://localhost:2060/zip`; // 更新包位置
  autoUpdater.setFeedURL(feedUrl);
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)

  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });

// 更新下载进度事件
autoUpdater.on('download-progress', function (progressObj) {
  console.log(progressObj)
  mainWindow.webContents.send('downloadProgress', progressObj)
  mainWindow.setProgressBar(progressObj.percent / 100);
})
autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
  console.log('更新完成')
  ipcMain.on('isUpdateNow', (e, arg) => {
    console.log("开始更新");
    //some code here to handle event
    autoUpdater.quitAndInstall();
  });

  mainWindow.webContents.send('isUpdateNow')
});

ipcMain.on("checkForUpdate",()=>{
  //执行自动更新检查
  autoUpdater.checkForUpdates();
})
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}