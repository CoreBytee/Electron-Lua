const HashA = require("hasha")
const FS = require("fs-extra")
const Path = require("path")
const SpawnSync = require("child_process").spawnSync

function HashFile(FilePath) {
    return HashA.fromFileSync(
        FilePath,
        {
            encoding: "hex",
            algorithm: "md5"
        }
    )
}
const ApplicationData = `${TypeWriter.ApplicationData}/ElectronHelper/`
const ExecutableRoot = Path.resolve(`${process.argv[1]}/../`)
const StoredHashFile = `${ApplicationData}/StoredHash.txt`

FS.ensureFileSync(StoredHashFile)
const TypeWriterHash = HashFile(TypeWriter.Executable)
var StoredHash = FS.readFileSync(StoredHashFile, "utf-8")
if (StoredHash == "") {
    StoredHash = "a"
}
const StoredHashFolder = `${ApplicationData}/${StoredHash}`
const FoundHashFolder = `${ApplicationData}/${TypeWriterHash}`

console.log(TypeWriterHash)
console.log(StoredHash)

console.log(
    Path.resolve(`${process.argv[1]}/../`)
)

if (TypeWriterHash != StoredHash) {
    console.log(StoredHashFolder)
    FS.removeSync(StoredHashFolder)
    FS.mkdirSync(FoundHashFolder)
    
    FS.copySync(
        ExecutableRoot,
        FoundHashFolder
    )
    FS.writeFileSync(StoredHashFile, TypeWriterHash)
}

console.log(process.argv)
console.log(require("electron"))