const WaitForEmitter = require('./lib/WaitForEmitter.js')
const WebSocket = require("universal-websocket-client")

//https://stackoverflow.com/a/1349426
function RandomString(length) {
    var result           = ''
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength))
    }
    return result
}

class IpcClient extends WaitForEmitter {
    constructor(Channel, Name) {
        super()
        this.Channel = Channel
        this.Name = Name
        this.Handlers = {}

        var ThisClass = this

        this.WebSocket = new WebSocket(`ws://localhost:25665/v1/connect/${Channel}/${Name}`)
        this.WebSocket.onopen = function () {
            ThisClass.emit("Connected")
        }
        this.WebSocket.onclose = function () {
            ThisClass.emit("Disconnected")
            ThisClass.emit("Return", {IPC_DISCONNECTED: true})
        }
        this.WebSocket.onmessage = async function (data) {
            var Decoded = JSON.parse(data.data.toString())
            ThisClass.HandleIncoming(Decoded)
        }
        

    }

    async RegisterMessage(Name, Function) {
        this.Handlers[Name] = Function
    }

    async HandleIncoming(D) {
        if (D.MessageType == "Return") {
            this.emit("Return", D)
            return
        }
        if (this.Handlers[D.Name] == null) {
            console.log("OpenIPC > Tried to handle a not existsing message (%s)", D.Name)
            return
        }
        var ReturnData = await this.Handlers[D.Name](D.Data, D.From, D.Sequence)
        await this.Write(
            "Message",
            {
                To: D.From,
                Sequence: D.Sequence,
                Data: ReturnData,
                MessageType: "Return"
            }
        )
    }

    async Write (Type, Payload) {
        const Data = {
            Type: Type,
            Payload: Payload
        }
        if (this.WebSocket.readyState != 1) {
            await this.WaitFor("Connected")
        }
        await this.WebSocket.send(JSON.stringify(Data))
    }

    async Send(To, Name, Payload) {
        var Sequence = RandomString(16)
        await this.Write(
            "Message",
            {
                To: To,
                Sequence: Sequence,
                Data: Payload,
                Name: Name,
                MessageType: "Message"
            }
        )
        const ReturnData = await this.WaitFor("Return", null,
            function (D) {
                return D.Sequence == Sequence
            }
        )
        if (ReturnData.IPC_DISCONNECTED == true) {
            return {IPC_DISCONNECTED: true, IPC_ERROR: true}
        } else {
            return ReturnData.Data
        }
    }

    async Disconnect() {
        await this.WebSocket.close()
    }
}

module.exports = IpcClient