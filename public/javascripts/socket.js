let namespaces
let namespaceSockets = []
let rooms = []

const ioClient = io({
    reconnection: false,
})

ioClient.on('connect', () => {
    console.log('connexion ok !')
})

ioClient.on('namespaces', (data) => {
    namespaces = data
    for (let ns of namespaces) {
        const nsSocket = io(`/${ns._id}`)
        nsSocket.on('rooms', (data) => {
            rooms.push(...data)
        })
        namespaceSockets.push(nsSocket)
    }
})
