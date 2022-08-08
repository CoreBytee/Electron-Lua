local FS = require("fs")

local ApplicationDataFolder = TypeWriter.ApplicationData .. "/Electron-Lua/"

return function (SkipUpdate)
    if SkipUpdate ~= true or FS.existsSync(ApplicationDataFolder .. "/Version.txt") == false then
        Import("Electron.bootstrap.Stages.Download")()
    end
    TypeWriter.Runtime.LoadFile(ApplicationDataFolder .. "/Electron-Lua.twr")
    return Import("Electron")
end