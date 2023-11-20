const FS = require("fs-extra")

module.exports = {
    Name: "ApplicationData",
    Execute: async function(Options, Data) {
        Data.ApplicationData = `${TypeWriter.ApplicationData}/ElectronHelper/`
        Data.Config = await Import("electronhelper.Config")
        FS.ensureDirSync(Data.ApplicationData)
        
        return Data
    }
}