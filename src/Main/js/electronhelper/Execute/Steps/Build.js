const FS = require("fs-extra")
const ElectronPackager = require("electron-packager")

function NeedsRebuild(Data, Options) {
    return (
        Data.BuildData.Name != Options.Name || // Has the name changed?
        Data.BuildData.IconHash != Data.IconHash || // Has the icon changed?
        Data.BuildData.ElectronVersion != Data.Config.ElectronVersion || // Has the electron version changed?
        Data.BuildData.TypeWriterHash != Data.TypeWriterHash // Has the typewriter hash changed?
    )

}

module.exports = {
    Name: "Build",
    Execute: async function(Options, Data) {
        Data.BuildData = FS.readJsonSync(`${Data.ApplicationFolder}/Data.json`, { throws: false }) || {}

        if (NeedsRebuild(Data, Options)) {
            FS.removeSync(Data.ApplicationFolder)
            
            const AppPath = await ElectronPackager(
                {
                    dir: Data.ExtractedTypeWriterPath,
                    name: Options.Name,
                    icon: Data.IconPath,
                    out: Data.ApplicationFolder,
                    electronVersion: Data.Config.ElectronVersion
                }
            )

            Data.BuildData = {
                Name: Options.Name,
                IconHash: Data.IconHash,
                ElectronVersion: Data.Config.ElectronVersion,
                TypeWriterHash: Data.TypeWriterHash,
                Executable: AppPath[0]
            }

            FS.writeJsonSync(`${Data.ApplicationFolder}/Data.json`, Data.BuildData)

        }

        if (TypeWriter.OS == "win32") {
            Data.Executable = `${Data.BuildData.Executable}/${Options.Name}.exe`
        } else if (TypeWriter.OS == "darwin") {
            Data.Executable = `${Data.BuildData.Executable}/${Options.Name}.app`
        }

        return Data
    }
}