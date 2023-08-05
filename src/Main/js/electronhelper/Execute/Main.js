const Steps = [
    Import("electronhelper.Execute.Steps.ApplicationData"),
    Import("electronhelper.Execute.Steps.ExportTypeWriter"),
    Import("electronhelper.Execute.Steps.ApplicationFolder"),
    Import("electronhelper.Execute.Steps.IconHash"),
    Import("electronhelper.Execute.Steps.Build"),
    Import("electronhelper.Execute.Steps.Execute")
]

module.exports = async function(PackageData) {
    var Data = {}

    for (const Step of Steps) {
        console.log(`Running step ${Step.Name}`)
        Data = await Step.Execute(PackageData, Data)
    }
}