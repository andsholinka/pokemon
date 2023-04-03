const {
    myPokemonList
} = require("../models");

const catchPokemon = async (req, res) => {

    try {
        let success = Math.random() < 0.5;
        if (success) {
            res.status(200).send({
                status: "Success",
                message: "Gotcha! You successfully caught " + req.params.name,
            })
        } else {
            res.status(200).send({
                status: "Failed",
                message: `You failed to catch the ${req.params.name}!`,
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: res.statusCode,
            message: e.message
        })
    }
}

const addPokemon = async (req, res) => {
    try {
        const data = await myPokemonList.create({
            pokemon_name: req.body.pokemon_name,
            nickname: req.body.nickname,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        res.status(201).send({
            status: "Success",
            message: `Success add ${data.pokemon_name} to My Pokemon List`,
            data
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: res.statusCode,
            message: e.message
        });
    }
}

module.exports = {
    catchPokemon,
    addPokemon
}