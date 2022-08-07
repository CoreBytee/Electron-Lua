const EventEmitter = require("events")
const WaitForEvent = require('wait-for-event-promise')

class WaitForEmitter extends EventEmitter {
    constructor() {
        super();
    }
    async WaitFor(Event, Timeout, Predicate) {
        if (Timeout == null) {
            return await WaitForEvent(
                this,
                Event,
                Predicate,
                {
                }
            )
        }
        return await WaitForEvent(
            this,
            Event,
            Predicate,
            {
                timeout: Timeout
            }
        )
    }
}

module.exports = WaitForEmitter