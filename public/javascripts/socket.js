let namespaces
let namespaceSockets = []
let rooms = []
// Nous déclarons deux nouvelles variables pour l’affichage
// des namespaces
let init = false
let activeNsSocket
// Nous ajoutons donc deux nouvelles variables. L’une pour
// la room active et l’autre pour les messages de la room active :
let activeRoom
let messages = []

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
            if (!init) {
                init = true
                activateNamespace(nsSocket)
                // Nous savons que le premier namespace est celui qui
                // est actif par défaut au début donc nous pouvons le passer :
                displayNamespaces(namespaces, nsSocket.nsp)
            }
        })
        // Cet événement sera émis par le serveur lorsque le client rejoindra une room
        // le serveur lui retournera tous les messages de la room :
        nsSocket.on('history', (data) => {
            // Nous stockons tous les messages
            messages = data
            // Et nous les affichons :
            displayMessages(messages)
        })

        // Cet événement sera reçu par la socket à chaque nouveau message
        // dans la room active. Nous allons simplement push le nouveau message
        // et réafficher tous les messages (nous optimiserons dans un autre chapitre)
        nsSocket.on('message', (data) => {
            messages.push(data)
            displayMessages(messages)
        })

        namespaceSockets.push(nsSocket)
    }
})

// Nous définissons la méthode qui va demander au serveur de faire
// rejoindre la room au client lorsqu’il clique sur le nom de la room côté
// client. La méthode ne fait qu’émettre un événement joinRoom avec l’id de la room :
function activateRoom(room) {
    activeNsSocket.emit('joinRoom', room._id)
    activeRoom = room
}

// Nous activons le premier namespace chargé, à savoir nous allons afficher
// les rooms de ce namespaces :
function activateNamespace(nsSocket) {
    activeNsSocket = nsSocket
    firstRoom = rooms.find(
        (room) =>
            `/${room.namespace}` === activeNsSocket.nsp && room.index === 0,
    )
    // Nous passons la première room du namespace comme celle active par défaut :
    displayRooms(
        rooms.filter((room) => `/${room.namespace}` === activeNsSocket.nsp),
        firstRoom._id,
    )
}
