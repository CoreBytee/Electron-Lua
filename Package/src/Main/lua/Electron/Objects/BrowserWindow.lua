local Emitter = Import("ga.corebyte.BetterEmitter")
local BrowserWindow = Emitter:extend()

local IgnoreMethods = {
    ['setMaxListeners'] = true,
    ['getMaxListeners'] = true,
    ['addListener'] = true,
    ['on'] = true,
    ["emit"] = true,
    ['prependListener'] = true,
    ['once'] = true,
    ['prependOnceListener'] = true,
    ['removeListener'] = true,
    ['off'] = true,
    ['removeAllListeners'] = true,
    ['listeners'] = true,
    ['rawListeners'] = true,
    ['listenerCount'] = true,
    ['eventNames'] = true,
    ['__defineGetter__'] = true,
    ['__defineSetter__'] = true,
    ['hasOwnProperty'] = true,
    ['__lookupGetter__'] = true,
    ['__lookupSetter__'] = true,
    ['isPrototypeOf'] = true,
    ['propertyIsEnumerable'] = true,
    ['toString'] = true,
    ['valueOf'] = true,
    ['toLocaleString'] = true,
    ["_init"] = true,
    ['_setTouchBarItems'] = true,
    ['_refreshTouchBarItem'] = true,
    ['_setEscapeTouchBarItem'] = true,
}

local function TitleCase(Str)
    return Str:gsub("^%l", string.upper)
end

function BrowserWindow:initialize(Data, Id, Options)
    self.Data = Data
    self.Id = Id
    if Options == nil then
        Options = {}
    end
    self.Options = Options
    local ObjectData = Data.IPC:Send(
        "Node",
        "CreateObject",
        {
            Type = "BrowserWindow",
            Data = Options,
            Id = Id
        }
    )

    local function AddMethod(Name, Method)
        self[Name] = function (self, ...)
            return Data.IPC:Send(
                "Node",
                "CallMethod",
                {
                    ObjectId = self.Id,
                    Method = Method,
                    Args = {...}
                }
            )
        end
    end
    for Index, Method in pairs(ObjectData.Methods) do
        if IgnoreMethods[Method] ~= true then
            AddMethod(TitleCase(Method), Method)
            AddMethod(Method, Method)
        end
    end
end

return BrowserWindow