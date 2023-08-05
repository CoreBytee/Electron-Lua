

async function Main() {
    const ElectronHelper = Import("electronhelper")

    const Electron = await ElectronHelper(
        {
            Id: "ElectronHelper",
            Name: "ElectronHelper",
        }
    )

    const App = Electron.app
    await App.whenReady()
    new Electron.BrowserWindow().loadURL("https://google.com")

    console.log(Electron)

}

Main()