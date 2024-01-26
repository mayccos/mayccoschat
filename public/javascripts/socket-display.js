// Nous devons ajouter un argument pour savoir si c’est le
// namespace actif :
function createNamespaceItem(namespace, isActive) {
    const li = document.createElement('li')
    li.classList.add('item-namespace', 'p-2', 'm-2')
    // Nous ajoutons la classe active si le namespace est actif :
    if (isActive) {
        li.classList.add('active')
    }
    li.innerHTML = `
      <img src="${namespace.imgUrl}" />
    `
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
