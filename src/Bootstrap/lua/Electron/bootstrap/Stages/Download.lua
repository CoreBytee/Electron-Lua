local Request = require("coro-http").request
local Json = require("json")
local FS = require("fs")

local ApplicationDataFolder = TypeWriter.ApplicationData .. "/Electron-Lua/"
local LatestReleaseURL = "https://api.github.com/repos/CoreBytee/Electron-Lua/releases/latest"
local FileUrl = "https://github.com/CoreBytee/Electron-Lua/releases/download/%s/%s"

local function IsConnected()
    local Success = pcall(Request, "GET", "https://github.com/CoreBytee/Electron-Lua")
    return Success
end

local function GetLatestTag()
    local Response, Body = Request(
        "GET",
        LatestReleaseURL,
        {
            {"User-Agent", "Electron-Lua (https://github.com/CoreBytee/Electron-Lua)"}
        }
    )
    return Json.parse(Body).tag_name
end

local Files = {
    "Electron.zip",
    "Electron-Lua.twr",
    "Electron-Lua-Bootstrap.twr"
}

local function DownloadFiles(Tag)
    for Index, FileName in pairs(Files) do
        TypeWriter.Logger.Info("Electron > Downloading " .. FileName .. "...")
        local Response, Body = Request(
            "GET",
            string.format(
                FileUrl,
                Tag,
                FileName
            ),
            {
                {"User-Agent", "Electron-Lua (https://github.com/CoreBytee/Electron-Lua)"}
            }
        )
        FS.writeFileSync(ApplicationDataFolder .. FileName, Body)
    end
end

return function ()
    local MustFinish = FS.existsSync(ApplicationDataFolder .. "/Version.txt") == false
    FS.mkdirSync(ApplicationDataFolder)
    if IsConnected() == false then
        TypeWriter.Logger.Error("Not connected to the internet.")
        if MustFinish == true then
            process:exit(0)
        end
        return false
    end

    local Tag = GetLatestTag()

    local CurrentVersion = FS.readFileSync(ApplicationDataFolder .. "/Version.txt")
    if CurrentVersion ~= Tag then
        local rmrf = require("coro-fs").rmrf
        for Index, FileName in pairs(FS.readdirSync(ApplicationDataFolder)) do
            local FilePath = ApplicationDataFolder .. "/" .. FileName
            local Success = rmrf(FilePath)
            if Success == nil then
                FS.unlinkSync(FilePath)
            end
        end
        DownloadFiles(Tag)
        FS.mkdirSync(ApplicationDataFolder .. "/Electron/")
        Import("Electron.bootstrap.Unzip")(ApplicationDataFolder .. "/Electron.zip", ApplicationDataFolder .. "/Electron/")
        local Response, Body = Request(
            "GET",
            "https://github.com/CoreBytee/open-ipc/releases/latest/download/IPC-Bootstrap.twr"
        )
        FS.writeFileSync(ApplicationDataFolder .. "/IPC-Bootstrap.twr", Body)

        local Response, Body = Request(
            "GET",
            "https://github.com/CoreBytee/get-node/releases/latest/download/Get-Node.twr"
        )
        FS.writeFileSync(ApplicationDataFolder .. "/Get-Node.twr", Body)

        FS.writeFileSync(ApplicationDataFolder .. "/Version.txt", Tag)

    end

    

    return true
end