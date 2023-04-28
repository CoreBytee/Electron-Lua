const Electron = Import("electronhelper")(
    "ElectronHelper",
    {
        Name: "ElectronHelper",
        Icon: {
            win32: "ElectronHelper:/icon.ico"
        },
        Load: "electronhelper.Test"
    }
)
