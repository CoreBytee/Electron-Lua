print("Hello World!")
p(TypeWriter.ApplicationData)
TypeWriter.Runtime.LoadFile(TypeWriter.ApplicationData .. "/Electron-Lua/IPC-Bootstrap.twr")
local Import("openipc.bootstrap").LoadAll()

local Data = {
    SessionId = string.random(32),
}