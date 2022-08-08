console.log("Hi from nodejs")
//Get LaunchArgs
const LaunchArgs = JSON.parse(Buffer.from(process.argv[2], "base64"))

//IPC imports
const IpcClient = require("./lib/OpenIPC/index.js")

//Electron imports
const Electron = require("electron")
const App = Electron.app

//Functions
async function PatchEmitter(Emitter, OnAny) {
    let OriginalEmit = Emitter.emit
    Emitter.emit = function(...Data) {
        if (OnAny) {
            OnAny(...Data)
        }
        OriginalEmit.apply(Emitter, Data)
    }
}

const GetMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

const IpcConnection = new IpcClient(`Electron-${LaunchArgs.SessionId}`, "Node")

App.on(
    "ready",
    function() {
        console.log("Electron > Ready")
        var Objects = {}
        IpcConnection.RegisterMessage(
            "CreateObject",
            async function(Data, From, Sequence) {
                console.log("Electron > CreateObject")
                const Object = new Electron[Data.Type](Data.Options)
                var ReturnData = {Emitter: false, Methods: {}}
                if (Object.emit) {
                    await PatchEmitter(Object, 
                        function(EventName, ...EventData) {
                            EventData.splice(0, 1)
                            IpcConnection.Send(
                                "Main",
                                "ObjectEvent",
                                {
                                    Name: EventName,
                                    Data: EventData,
                                    ObjectId: Data.Id
                                }
                            )
                        }
                    )
                    ReturnData.Emitter = true
                }
                ReturnData.Methods = GetMethods(Object)
                
                Objects[Data.Id] = Object
                return ReturnData
            }
        )
        IpcConnection.RegisterMessage(
            "CallMethod",
            async function(Data, From, Sequence) {
                console.log("Electron > CallMethod")
                return await Objects[Data.ObjectId][Data.Method](...Data.Args)
            }
        )
        IpcConnection.Send(
            "Main",
            "AppReady",
            null
        )
    }
)