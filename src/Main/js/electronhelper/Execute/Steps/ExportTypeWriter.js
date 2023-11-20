const FS = require("fs-extra")
const Path = require("path")
const HashFile = await Import("electronhelper.Libraries.HashFile")

module.exports = {
    Name: "ExportTypeWriter",
    Execute: async function(Options, Data) {
        Data.StoredHashFile = `${Data.ApplicationData}/StoredHash.txt`
        Data.ExtractedTypeWriterPath = `${Data.ApplicationData}/TypeWriter/`

        FS.ensureFileSync(Data.StoredHashFile)
        const CurrentHash = HashFile(TypeWriter.Executable)
        const StoredHash = FS.readFileSync(Data.StoredHashFile, "utf8")
        Data.TypeWriterHash = CurrentHash

        if (CurrentHash != StoredHash) {
            FS.removeSync(Data.ExtractedTypeWriterPath)
            FS.copySync(Path.resolve("/snapshot/"), Data.ApplicationData)
            FS.writeFileSync(Data.StoredHashFile, CurrentHash)
        }

        return Data
    }
}