const FS = require("fs-extra")
const ElectronPackager = require("electron-packager")
const SpawnSync = require("child_process").spawnSync

const ApplicationData = `${TypeWriter.ApplicationData}/ElectronHelper/`
const TypeWriterExportData = Import("electronhelper.Helpers.ExportTypeWriter")()
const ExportedFolder = TypeWriterExportData[0]
const ExportedHash = TypeWriterExportData[1]
const ApplicationsFolder = `${ApplicationData}/Applications/`
const ElectronHelperConfig = Import("electronhelper.Config")
FS.ensureDirSync(ApplicationsFolder)

function NeedsRebuild(StoredData, PackageData) {
    return StoredData.Name != PackageData.Name || StoredData.IconHash != PackageData.IconHash || StoredData.ElectronVersion != ElectronHelperConfig.ElectronVersion || StoredData.TypeWriterHash != ExportedHash
}

function Run(PackageData) {
    const ThisApplicationFolder = `${ApplicationsFolder}/${PackageData.PackageId}/`
    FS.ensureDirSync(ThisApplicationFolder)

    var StoredData = FS.readJSONSync(`${ThisApplicationFolder}/ApplicationData.json`, { throws: false }) || {}

    function CallExe() {
        SpawnSync(
            StoredData.ApplicationExecutable,
            [
                `${ExportedFolder}/Index.js`, ...process.argv.slice(2)
            ],
            {
                cwd: process.cwd(),
                stdio: "inherit",
                windowsHide: false
            }
        )
        process.exit(0)
    }

    if (NeedsRebuild(StoredData, PackageData)) {
        if (StoredData.ApplicationFolder) {
            FS.removeSync(StoredData.ApplicationFolder)
        }

        ElectronPackager(
            {
                dir: ExportedFolder,
                name: PackageData.Name,
                icon: PackageData.IconPath,
                out: ThisApplicationFolder,
                electronVersion: "23.1.4"
            }
        ).then(
            function(AppPath) {
                if (typeof AppPath == "array") {
                    return
                }
                FS.writeJSONSync(
                    `${ThisApplicationFolder}/ApplicationData.json`,
                    {
                        PackageId: PackageData.PackageId,
                        Name: PackageData.Name,
                        Icon: PackageData.Icon,
                        IconHash: PackageData.IconHash,
    
                        ApplicationFolder: AppPath[0],
                        ApplicationExecutable: `${AppPath[0]}/${TypeWriter.OS == "win32" ? `${PackageData.Name}.exe` : "unknown"}`,
    
                        ElectronVersion: ElectronHelperConfig.ElectronVersion,
                        TypeWriterHash: ExportedHash
                    }
                )
                StoredData = FS.readJSONSync(`${ThisApplicationFolder}/ApplicationData.json`)
                CallExe()
                process.exit(0)
            }
        )

    } else {
        CallExe()
    }
    

}

// SpawnSync(
//     require("electron"),
//     [
//         `${ExportedFolder}/Index.js`, ...process.argv.slice(2)
//     ],
//     {
//         stdio: "inherit",
//         windowsHide: false
//     }
// )

// process.exit(0)

module.exports = Run