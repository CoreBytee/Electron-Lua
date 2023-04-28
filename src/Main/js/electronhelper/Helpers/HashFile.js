const HashA = require("hasha")

function HashFile(FilePath) {
    return HashA.fromFileSync(
        FilePath,
        {
            encoding: "hex",
            algorithm: "md5"
        }
    )
}

module.exports = HashFile