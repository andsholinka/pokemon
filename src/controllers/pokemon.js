const {
    myPokemonList
} = require("../models");
const pokeApi = require('../service/pokeApi');

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

const getMyPokemonList = async (req, res) => {

    try {
        const pageAsNumber = parseInt(req.query.page);
        const sizeAsNumber = parseInt(req.query.size);

        let page = 0;
        if (!isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber;
        }

        let size = 5;
        if (!isNaN(sizeAsNumber) && !(sizeAsNumber > 10) && !(sizeAsNumber < 1)) {
            size = sizeAsNumber;
        }

        const usersWithCount = await myPokemonList.findAndCountAll({
            limit: size,
            offset: page * size,
            attributes: ['id', 'pokemon_name', 'nickname'],
        });


        await Promise.all(
            usersWithCount.rows.map(async (result) => {
                const image = await pokeApi.getImage(req, res, result.pokemon_name);
                const type = await pokeApi.getType(req, res, result.pokemon_name);
                const move = await pokeApi.getMove(req, res, result.pokemon_name);

                result.image = image
                result.type = type
                result.move = move
            })
        )

        const pokemon = usersWithCount.rows.map((result) => ({
            id: result.id,
            name: result.pokemon_name,
            nickname: result.nickname,
            image: result.image,
            type: result.type,
            move: result.move
        }));

        return res.status(200).json({
            count: usersWithCount.count,
            data: pokemon,
            totalPages: Math.ceil(usersWithCount.count / parseInt(size))
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: res.statusCode,
            message: e.message
        })
    }
}

const releasePokemon = async (req, res) => {
    try {

        const data = await myPokemonList.findOne({
            where: {
                id: req.params.id
            }
        })

        if (data == null) {
            res.status(404).send({
                status: res.statusCode,
                message: `Pokemon with ID ${req.params.id} Not Found`,
            })
            return
        }

        let number = Math.floor((Math.random() * 10) + 1);

        if (number % 2 === 0) {
            console.log(number + " is a prime number");
            await myPokemonList.destroy({
                where: {
                    id: req.params.id,
                }
            })
            res.status(200).json({
                status: res.statusCode,
                message: `pokemon ${data.nickname} successfully released`,
            });
        } else {
            console.log(number + " is not a prime number");

            res.status(400).json({
                status: res.statusCode,
                message: `failed to release pokemon ${data.nickname}, try again!`,
            });
        }

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
    addPokemon,
    getMyPokemonList,
    releasePokemon
}