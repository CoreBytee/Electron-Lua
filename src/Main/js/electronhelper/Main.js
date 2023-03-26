require("fs-extra").ensureDirSync(`${TypeWriter.ApplicationData}/ElectronHelper/`)

if (require("is-electron")()) {
    module.exports = require("electron")
} else {
    Import("electronhelper.run")
}