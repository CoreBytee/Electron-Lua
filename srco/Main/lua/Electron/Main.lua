local Resources = TypeWriter.LoadedPackages["Electron-Lua"].Resources
TypeWriter.Runtime.LoadJson(Resources["/OpenIPC-TypeWriter.twr"])
TypeWriter.Runtime.LoadJson(Resources["/Get-Node.twr"])
TypeWriter.Runtime.LoadInternal("BetterEmitter")

local NodePath, NodeVersion = Import("ga.corebyte.get-node").Download()
local IPClient = Import("openipc.connector")
local Emitter = Import("ga.corebyte.BetterEmitter")
local FS = require("FS")

local ApplicationData = TypeWriter.ApplicationData .. "/Electron-Lua/"
FS.mkdirSync(ApplicationData)
do
    local ThisVersion = TypeWriter.LoadedPackages["Electron-Lua"].Package.Version
    local ExtractVersionFile = ApplicationData .. "/ExtractVersion.txt"
    local ThatVersion = FS.readFileSync(ExtractVersionFile)
    if ThisVersion ~= ThatVersion then
        TypeWriter.Logger.Warn("Invalid electron install found, installing.")
        local ExtractFolder = ApplicationData .. "/Electron/"
        local ElectonArchive = ApplicationData .. "/Electron.zip"
        require("coro-fs").rmrf(ExtractFolder)
        FS.writeFileSync(
            ElectonArchive,
            Resources["/Electron.zip"]
        )
        Import("Electron.Unzip")(ElectonArchive, ExtractFolder)
        FS.writeFileSync(ExtractVersionFile, ThisVersion)
    end
end

local Data = {
    SessionId = string.random(32),
    IsDev = TypeWriter.ArgumentParser:GetArgument("is-dev", "is-dev", "false") == "true",
    ElectronLocation = ApplicationData .. "/Electron/",
}
if Data.IsDev == true then
    Data.ElectronLocation = "./Electron/"
end
Data.IPC = IPClient:new("Electron-" .. Data.SessionId, "Main")
local IPC = Data.IPC

local Spawn = require("coro-spawn")
if FS.existsSync(Data.ElectronLocation .. "/node_modules/") == false then
    TypeWriter.Logger.Info("Installing node dependencies...")
    local function InstallDeps(Location)
        local Result = Spawn(
            NodePath .. "/npm" .. (({["win32"] = ".cmd"})[TypeWriter.Os] or ""),
            {
                args = {
                    "install",
                    "--omit=dev"
                },
                cwd = Location,
                stdio = {
                    process.stdin.handle,
                    process.stdout.handle,
                    process.stderr.handle,
                }
            }
        )
        Result.waitExit()
    end
    InstallDeps(Data.ElectronLocation)
    InstallDeps(Data.ElectronLocation .. "/lib/OpenIPC/")
end

local MadeObjects = {}
IPC:RegisterMessage(
    "ObjectEvent",
    function(Message)
        local Object = MadeObjects[Message.ObjectId]
        if Object ~= nil then
            Object:Emit(Message.Name, table.unpack(Message.Data))
        end
    end
)

local ReadyEmitter = Emitter:new()
IPC:RegisterMessage(
    "AppReady",
    function ()
        ReadyEmitter:Emit("ready")
    end
)

local Result, Error = Spawn(
    NodePath .. "/npm" .. (({["win32"] = ".cmd"})[TypeWriter.Os] or ""),
    {
        args = {
            "run", "start", require("base64").encode(require("json").encode(
                {
                    SessionId = Data.SessionId,
                    IsDev = Data.IsDev,
                    ElectronLocation = Data.ElectronLocation,
                }
            ))
        },
        cwd = Data.ElectronLocation,
        stdio = {
            process.stdin.handle,
            process.stdout.handle,
            process.stderr.handle,
        }
    }
)
ReadyEmitter:WaitFor("ready")

local Objects = {
    BrowserWindow = Import("Electron.Objects.BrowserWindow")
}
local ObjectWrappers = {}
for Index, Object in pairs(Objects) do
    ObjectWrappers[Index] = function (...)
        local NewId = string.random(64)
        local NewObject = Object:new(Data, NewId, ...)
        MadeObjects[NewId] = NewObject
        return NewObject
    end
end
ObjectWrappers.Close = function ()
    IPC:Send("Node", "Close")
    IPC:Disconnect()
end
return ObjectWrappers