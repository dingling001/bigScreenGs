const {app, BrowserWindow, Menu } = require('electron')
let mainWindow;

function createWindow () {  
	mainWindow = new BrowserWindow({
		width: 3840,
		height: 2160,
		frame: true,
		fullscreen: true,
		alwaysOnTop: false,
		backgroundColor: "#000015"
	})
	// 打开调试
//	mainWindow.webContents.openDevTools()
	// 设置菜单
	const template = [
		{
			label: 'menu',
			submenu: [
				{ role: 'reload', label: '刷新' },
				{ role: 'forcereload', label: '强制刷新' },
				{ role: 'togglefullscreen', label: '切换全屏' },
				{ role: 'close', label: '关闭' }
			]
		}
	];
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
	// 设置菜单栏自动隐藏，按Alt键显示
	mainWindow.setAutoHideMenuBar(true)
	
	// 打开入口
//	mainWindow.loadFile("web/index.html")
	mainWindow.loadURL("https://www.hymuseum.org.cn/api/screen/index?p=w&page=moni_center2")
	
  	mainWindow.on('closed', function () {
    	mainWindow = null
 	})
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('--disable-http-cache');
app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})






