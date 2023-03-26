require("fs-extra").ensureDirSync(`${TypeWriter.ApplicationData}/ElectronHelper/`)

if (require("is-electron")()) {
    module.exports = TypeWriter.OriginalRequire("electron")
} else {
    Import("electronhelper.run")
}