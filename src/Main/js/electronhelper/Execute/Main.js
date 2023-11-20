const Steps = [
    await Import("electronhelper.Execute.Steps.ApplicationData"),
    await Import("electronhelper.Execute.Steps.ExportTypeWriter"),
    await Import("electronhelper.Execute.Steps.ApplicationFolder"),
    await Import("electronhelper.Execute.Steps.IconHash"),
    await Import("electronhelper.Execute.Steps.Build"),
    await Import("electronhelper.Execute.Steps.Execute")
]

module.exports = async function(PackageData) {
    var Data = {}

    for (const Step of Steps) {
        console.log(`Running step ${Step.Name}`)
        Data = await Step.Execute(PackageData, Data)
    }
}