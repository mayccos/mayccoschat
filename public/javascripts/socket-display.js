// Nous devons ajouter un argument pour savoir si c’est le
// namespace actif :
function createNamespaceItem(namespace, isActive) {
    const li = document.createElement('li')
    li.classList.add('item-namespace', 'p-2', 'm-2')
    if (isActive) {
        li.classList.add('active')
    }
    li.innerHTML = `
      <img src="${namespace.imgUrl}" />
    `
    li.addEventListener('click', () => {
        if (activeNsSocket.nsp !== `/${namespace._id}`) {
            // Lorsque nous quittons le namespace, nous commençons par demander au
            // serveur de nous faire quitter la room actuelle :
            activeNsSocket.emit('leaveRoom', activeRoom._id)
            // Puis nous récupérons la bonne socket correspondant à l’id du namespace
            // sélectionné par l’utilisateur :
            const ns = namespaceSockets.find(
                (ns) => ns.nsp === `/${namespace._id}`,
            )
            // Pour nous l’activons et nous réaffichons les namespaces :
            activateNamespace(ns)
            displayNamespaces(namespaces, ns.nsp)
        }
    })
    return li
}

function displayNamespaces(namespaces, activeNsp) {
    // Nous récupérons notre élément ul déclaré dans le partial views/partials/namespaces.ejs :
    const namespacesContainer = document.querySelector('.list-namespaces')
    // Pour chaque namespace de la liste des namespaces que nous recevons, nous créons
    // une élément de liste li
    // Pour savoir si un namespace est actif nous le recevons en argument
    // et nous renvoyons un booléen suivant que l’itération du namespace
    // est le namespace actif :
    const items = namespaces.map((namespace) =>
        createNamespaceItem(namespace, activeNsp === `/${namespace._id}`),
    )
    // Nous plaçons l’ensemble des li sur le DOM dans notre ul :
    namespacesContainer.innerHTML = ''
    namespacesContainer.prepend(...items)
}

// Même chose nous passons un argument pour savoir
// la room active au sein d’un namespace :
function createRoomItem(room, isActive) {
    const li = document.createElement('li')
    li.classList.add('item-room', 'p-2', 'm-2')
    // Nous ajoutons la classe active si la room est active

    if (isActive) {
        li.classList.add('active')
    }
    li.innerHTML = `
      # ${room.title}
    `
    // Lorsque nous cliquons sur une room :
    li.addEventListener('click', () => {
        // et que la room n’est pas déjà active
        if (activeRoom._id !== room._id) {
            // Alors nous émettons l’événement pour demander au serveur de quitter
            // la room active jusqu’à maintenant :
            activeNsSocket.emit('leaveRoom', activeRoom._id)
            // Et de nous connecter à la nouvelle room :
            activateRoom(room)
            // Et nous réaffichons les rooms :
            displayRooms(
                rooms.filter(
                    (room) => `/${room.namespace}` === activeNsSocket.nsp,
                ),
                room._id,
            )
        }
    })
    return li
}

function displayRooms(rooms, activeRoomId) {
    const roomsContainer = document.querySelector('.list-rooms')
    // Même chose, pour passer le booléen pour savoir si la room est active
    // nous comparons pour chaque itération l’id de la room passée en argument :
    const items = rooms.map((room) =>
        createRoomItem(room, activeRoomId === room._id),
    )
    roomsContainer.innerHTML = ''
    roomsContainer.prepend(...items)
}

function createMessageItem(message) {
    const li = document.createElement('li')
    li.classList.add('item-message', 'd-flex', 'flex-row', 'mb-2')
    li.innerHTML = `
      <span class="me-1">${message.time}</span>
      <strong class="me-3">${message.authorName}</strong>
      <span class="flex-fill">${message.data}</span>
    `
    return li
}

function displayMessages(messages) {
    const messagesContainer = document.querySelector('.list-messages')
    // Pour chaque message, nous allons parser la date pour la convertir à l’heure locale
    // et pour l’afficher simplement puis la passer à la fonction créant les éléments HTML :
    const items = messages.map((message) =>
        createMessageItem({
            ...message,
            time: new Date(message.updatedAt).toLocaleTimeString(),
        }),
    )
    messagesContainer.innerHTML = ''
    // Nous insérons les éléments sur le DOM dans l’élément ul :
    messagesContainer.prepend(...items)
    // S’il y a plus d’un élément nous défilons jusqu’à celui-ci :
    if (items.length) {
        items[items.length - 1].scrollIntoView()
    }
}
