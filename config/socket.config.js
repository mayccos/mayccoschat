const socketio = require('socket.io')
const { server } = require('../app')
const { ensureAuthenticatedOnSocketHandshake } = require('./security.config')
const { getNamespaces } = require('../queries/namespace.queries')
const { findRoomPerNamespaceId } = require('../queries/room.queries')
let ios
let namespaces

const initNamespaces = async () => {
    try {
        // Lors du lancement du serveur les namespaces sont récupérés
        // et stockés en mémoire dans une variable :
        namespaces = await getNamespaces()
        // Pour chacun des namespaces récupérés :
        for (let namespace of namespaces) {
            // Nous créons un namespace socket.io avec l’id
            // du namespace :
            const ns = ios.of(`/${namespace._id}`)
            // Chacun des namespaces a un gestionnaire d’événement
            // dans le cas où une socket se connecte :
            ns.on('connect', async (nsSocket) => {
                try {
                    //  Etape 3 (partie serveur) nsSocket est une socket connecté à un
                    //  des namespaces lors de sa connexion au namespace, les rooms du
                    //  namespace lui sont retournées :
                    const rooms = await findRoomPerNamespaceId(namespace._id)
                    nsSocket.emit('rooms', rooms)
                } catch (e) {
                    throw e
                }
            })
        }
    } catch (e) {
        throw e
    }
}

const initSocketServer = () => {
    ios = socketio(server, {
        // Etape 1 : le client se connecte et est authentifié
        allowRequest: ensureAuthenticatedOnSocketHandshake,
    })
    ios.on('connect', (socket) => {
        console.log('connexion ios ok')
        // Etape 2 le serveur lui envoie les namespaces récupérées lors
        // de sa connexion au namespace /
        // (ils sont récupérés au lancement du serveur socket.io) :
        socket.emit('namespaces', namespaces)
    })

    ios.on('close', (socket) => {
        socket.disconnect(true)
    })
    initNamespaces()
}

initSocketServer()