require("fs-extra").ensureDirSync(`${TypeWriter.ApplicationData}/ElectronHelper/`)

function HandlePackageData(PackageId, PackageData) {
    const IconResourceLocation = (PackageData.Icon || {})[process.platform] || null
    var IconPath
    var IconHash
    if (IconResourceLocation) {
        IconPath = TypeWriter.ResourceManager.GetFilePath(IconResourceLocation)
        IconHash = Import("electronhelper.Helpers.HashFile")(IconPath)
    }
    return {
        PackageId: PackageId,
        Name: PackageData.Name || PackageId,
        Icon: IconResourceLocation,
        IconPath: IconPath,
        IconHash: IconHash
    }
}

module.exports = function(PackageId, PackageData) {
    if (require("is-electron")()) {
        if (PackageData) {
            if (PackageData.Load) {
                Import(PackageData.Load)
            }
        }
        return TypeWriter.OriginalRequire("electron")
    } else {
        const CompiledPackageData = HandlePackageData(PackageId, PackageData)
        Import("electronhelper.run")(CompiledPackageData)
    }
}