const FS = require("fs-extra")
const Path = require("path")
const HashFile = Import("electronhelper.Helpers.HashFile")

const ApplicationData = `${TypeWriter.ApplicationData}/ElectronHelper/`
const ExtractedElectronFile = `${ApplicationData}/ElectronVersion.txt`
const ElectronHelperConfig = Import("electronhelper.Config")

function ExportElectron(ExportedTypeWriterPath) {
    FS.ensureFileSync(ExtractedElectronFile)
    const ExtractedElectronVersion = FS.readFileSync(ExtractedElectronFile, "utf-8")

    if (ExtractedElectronVersion != ElectronHelperConfig.ElectronVersion) {

        function ScanModules(Path) {
            for (const FileName of FS.readdirSync(Path)) {
                const FolderPath = `${Path}/${FileName}`
                if (FileName.startsWith("@")) {
                    ScanModules(FolderPath)
                } else {
                    if (FS.lstatSync(FolderPath).isSymbolicLink()) {
                        const LinkPath = FS.readlinkSync(FolderPath)
                        ExportModule(LinkPath)
                    } else {
                        ExportModule(FolderPath)
                    }
                }
            }
        }

        function ExportModule(ModulePath) {
            ModulePath = Path.resolve(ModulePath)
            const OutputPath = `${ExportedTypeWriterPath}/node_modules/${FS.readJSONSync(`${ModulePath}/package.json`).name}/`
            if (!FS.existsSync(OutputPath)) {
                FS.ensureDirSync(OutputPath)
                FS.copySync(
                    ModulePath,
                    OutputPath,
                    {
                        filter: function(FilterPath) {
                            return !FS.lstatSync(FilterPath).isSymbolicLink()
                        },
                        overwrite: true
                    }
                )
            }

            ScanModules(`${ModulePath}/node_modules/`)
        }

        ExportModule(ElectronHelperConfig.ElectronPath)
        FS.writeFileSync(ExtractedElectronFile, ElectronHelperConfig.ElectronVersion)
    }
}

function ExportTypeWriter() {
    const StoredHashFile = `${ApplicationData}/StoredHash.txt`
    const ExecutableRoot = Path.resolve(`${process.argv[1]}/../`)

    FS.ensureFileSync(StoredHashFile)
    const TypeWriterHash = HashFile(TypeWriter.Executable)
    var StoredHash = FS.readFileSync(StoredHashFile, "utf-8")
    if (StoredHash == "") {
        StoredHash = "a"
    }
    const StoredHashFolder = `${ApplicationData}/${StoredHash}`
    const FoundHashFolder = `${ApplicationData}/${TypeWriterHash}`

    if (TypeWriterHash != StoredHash) {
        FS.removeSync(StoredHashFolder)
        FS.removeSync(ExtractedElectronFile)
        FS.mkdirSync(FoundHashFolder)
        
        FS.copySync(
            ExecutableRoot,
            FoundHashFolder
        )
        
        const PackageData = FS.readJsonSync(`${FoundHashFolder}/package.json`)
        PackageData.devdependencies = {}
        PackageData.devdependencies.electron = ElectronHelperConfig.ElectronVersion
        FS.writeJsonSync(`${FoundHashFolder}/package.json`, PackageData)

        FS.renameSync(`${FoundHashFolder}/Index.js`, `${FoundHashFolder}/TypeWriterIndex.js`)
        FS.copyFileSync(TypeWriter.ResourceManager.GetFilePath("ElectronHelper:/NewIndex.js"), `${FoundHashFolder}/Index.js`)

        FS.writeFileSync(StoredHashFile, TypeWriterHash)
    }

    ExportElectron(FoundHashFolder)

    return [FoundHashFolder, TypeWriterHash]
}

module.exports = ExportTypeWriter