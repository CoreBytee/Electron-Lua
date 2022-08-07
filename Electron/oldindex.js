const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
      Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
  }

const { app, BrowserWindow } = require('electron')
console.log(require("electron"))

const createWindow = () => {
    const Window = new BrowserWindow(
        {
            width: 500,
            height: 500
        }
    )

    //console.dir(getMethods(Window), {'maxArrayLength': null})
  
    Window.loadURL("Https://google.com")
}

app.whenReady().then(() => {
    createWindow()
  })