const FS = require("fs-extra")
const HashFile = Import("electronhelper.Libraries.HashFile")

const OsNames = {
    win32: "Windows",
    darwin: "MacOs"
}

module.exports = {
    Name: "IconHash",
    Execute: async function(Options, Data) {
        Data.IconPath = TypeWriter.ResourceManager.GetFilePath(Options.Icon[OsNames[TypeWriter.OS]])
        Data.IconHash = HashFile(Data.IconPath)

        return Data
    }
}