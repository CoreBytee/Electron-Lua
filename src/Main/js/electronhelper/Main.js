require("fs-extra").ensureDirSync(`${TypeWriter.ApplicationData}/ElectronHelper/`)

if (require("is-electron")()) {
    console.log("Running Electron")
} else {
    console.log("Not running Electron")
    Import("electronhelper.run")
}