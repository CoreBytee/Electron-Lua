const DefaultOptions = require("default-options")
const IsElectron = require("is-electron")

function HandleOptions(Options) {
    return DefaultOptions(
        Options,
        {
            Id: undefined,
            Name: undefined,
            Icon: {
                Windows: "ElectronHelper:/logo.ico",
                MacOs: "ElectronHelper:/logo.icns",
            }
        }
    )
}

module.exports = async function(Options) {
    Options = HandleOptions(Options)
    
    if (IsElectron()) {
        TypeWriter.Logger.Information("ElectronHelper is running in electron")
        return TypeWriter.OriginalRequire("electron")
    }

    TypeWriter.Logger.Information("ElectronHelper is currently starting electron")

    await (Import("electronhelper.Execute"))(Options)

    TypeWriter.Logger.Information("ElectronHelper has finished running")
    process.exit(0)
}