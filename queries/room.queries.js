const { Room } = require('../database/models')

exports.findRoomPerNamespaceId = (namespaceId) => {
    return Room.find({ namespace: namespaceId }).exec()
}
