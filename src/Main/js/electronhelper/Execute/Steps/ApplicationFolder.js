const FS = require("fs-extra")

module.exports = {
    Name: "ApplicationFolder",
    Execute: async function(Options, Data) {
        Data.ApplicationsFolder = `${Data.ApplicationData}/Applications/`
        FS.ensureDirSync(Data.ApplicationsFolder)
        Data.ApplicationFolder = `${Data.ApplicationsFolder}/${Options.Id}/`
        FS.ensureDirSync(Data.ApplicationFolder)

        return Data
    }
}