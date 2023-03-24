require("fs-extra").ensureDirSync(`${TypeWriter.ApplicationData}/ElectronHelper/`)

if (require("is-electron")()) {
    console.log("aaaa")
    console.log(require("electron").app)
    module.exports = require("electron")
} else {
    Import("electronhelper.run")
}