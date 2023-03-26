const Electron = Import("electronhelper")
const App = Electron.app
const BrowserWindow = Electron.BrowserWindow

App.on("ready", function() {
    console.log("Ready")
    const Window = new BrowserWindow(
        {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        }
    )
    Window.loadURL("https://www.google.com")
})
//console.log(Electron)