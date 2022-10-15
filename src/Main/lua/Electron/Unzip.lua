return function (From, To)
    require("fs").mkdirSync(To)
    local Result = require("coro-spawn")(
        "tar",
        {
            args = {
                "-xf",
                From,
                "-C", To
            }
        }
    )
    Result.waitExit()
end