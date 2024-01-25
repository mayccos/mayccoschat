const mongoose = require('mongoose')
require('dotenv').config()

exports.clientPromise = mongoose
    .connect(
        `mongodb+srv://mayccos:${process.env.MONGODB_PASSWORD}@cluster-projet-14.nxgcf.mongodb.net/mayccoschat`,
    )
    .then((client) => {
        console.log(`connexion  à la db établie`)
        return client
    })

    .catch((err) => console.log(err))
