window.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('input')
    const btn = document.querySelector('button')
    input.focus()

    function submitMessage() {
        const value = input.value
        if (value) {
            // Nous émettons simplement le message en passant comme données un objet
            // contenant le texte du champ et l’id de la room :
            activeNsSocket.emit('message', {
                text: value,
                roomId: activeRoom._id,
            })
            input.value = ''
            // Nous redonnons le focus au champ pour pouvoir enchaîner les messages :
            input.focus()
        }
    }
    // Nous envoyons le message en utilisant sur le bouton :
    btn.addEventListener('click', submitMessage)

    // Ou en pressant l’un des touches entrée du clavier :
    input.addEventListener('keyup', (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            submitMessage()
        }
    })
})
