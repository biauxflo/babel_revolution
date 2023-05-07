const path = require('path')
const {Node} = require(path.resolve('sequelize', 'models'))
const db = require(path.resolve('sequelize', 'models', 'index.js'))

exports.getNodes = (req, res, next) => {
    Node.findAll()
        .then(nodes => {
            console.log(nodes)
            res.status(200).json(nodes)
        })
        .catch(error => res.status(400).json({ error }))
}

exports.addNewNode = (req, res, next) => {
    let received = req.body;
    console.log(received);
    let hashtags = received.hashtags.join(';');
    const node = Node.create({
        author: received.author,
        text: received.text,
        hashtags: hashtags,
        belief:received.belief,
        decree:received.decree,
        title:received.title,
        type:received.type
    })
        .then(()=>res.status(201).json("Objet crée"))
        .catch(error => res.status(400).json({ error }));
}

exports.resetNodes = (req, res, next) => {
    Node.destroy({where : {id : null}})
        .then(ressource =>{
            if (ressource === 0) return res.status(404).json("Pas de ressources")
            else return  res.status(201).json(ressource + " ressources supprimées")
        })
        .catch(err => console.log(err))
}