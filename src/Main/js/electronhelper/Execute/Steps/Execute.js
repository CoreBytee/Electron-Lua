const SpawnSync = require("child_process").spawnSync

module.exports = {
    Name: "Execute",
    Execute: async function(Options, Data) {
        console.log(SpawnSync(
            Data.Executable,
            [
                `${Data.ExtractedTypeWriterPath}/Index.js`, ...process.argv.slice(2)
            ],
            {
                cwd: process.cwd(),
                stdio: "inherit",
                windowsHide: false
            }
        ))
        
        return Data
    }
}