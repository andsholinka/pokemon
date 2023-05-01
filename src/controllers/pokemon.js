const {
    myPokemonList
} = require("../models");
const pokeApi = require('../service/pokeApi');

function fibonacci(n) {
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);

}

function validation(str) {
    return /^[ A-Za-z0-9()_]*$/.test(str);
}

function isFirst(str) {
    return /[-]/.test(str);
}

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
        console.log(e.message);
        res.status(400).send({
            status: res.statusCode,
            message: e.message
        });
    }
}

const addPokemon = async (req, res) => {
    try {

        if (!validation(req.body.nickname)) throw new Error(`Nickname ${req.body.nickname} is not valid`);

        const data = await myPokemonList.create({
            pokemon_name: req.body.pokemon_name,
            nickname: req.body.nickname,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        res.status(201).send({
            status: "Success",
            message: `Success add ${req.body.nickname} to My Pokemon List`,
            data
        })

    } catch (e) {
        console.log(e.message);
        res.status(400).send({
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
            nickname: result.nickname.split('-')[0],
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
        console.log(e.message);
        res.status(400).send({
            status: res.statusCode,
            message: e.message
        });
    }
}

const releasePokemon = async (req, res) => {
    try {

        const data = await myPokemonList.findOne({
            where: {
                id: req.params.id
            }
        })

        if (data == null) throw new Error(`Pokemon with ID ${req.params.id} Not Found`);

        let number = Math.floor((Math.random() * 10) + 1);
        console.log(number);

        if (number % 2 != 0) throw new Error(`failed to release pokemon ${data.nickname}, try again!`);

        if (number % 2 === 0) {
            await myPokemonList.destroy({
                where: {
                    id: req.params.id,
                }
            })
            res.status(200).json({
                status: res.statusCode,
                message: `pokemon ${data.nickname} successfully released`,
            });
        }

    } catch (e) {
        console.log(e.message);
        res.status(400).send({
            status: res.statusCode,
            message: e.message
        });
    }
}

const renamePokemon = async (req, res) => {
    try {

        
        const data = await myPokemonList.findOne({
            where: {
                id: req.params.id
            }
        })
        
        if (data == null) throw new Error(`Pokemon with ID ${req.params.id} Not Found`);
        
        if (!validation(req.body.nickname)) throw new Error(`Nickname ${req.body.nickname} is not valid`);
        
        if (!isFirst(data.nickname)) {
            var nextFibo = fibonacci(0)
            await data.update({
                nickname: `${req.body.nickname}-${nextFibo}`,
                updatedAt: Date.now(),
            });

            return res.status(200).send({
                status: res.statusCode,
                message: 'Success',
                data: data.nickname
            })
        }

        if (data.nickname.split('-').pop() == 0) {
            var lastFibo = parseInt(data.nickname.split('-').pop()) + 1;
            var nextFibo = fibonacci(lastFibo);
            await data.update({
                nickname: `${req.body.nickname}-${nextFibo}`,
                updatedAt: Date.now(),
            });

            return res.status(200).send({
                status: res.statusCode,
                message: 'Success',
                data: data.nickname
            })
        }

        if (data.nickname.split('-').pop() == 1) {
            var lastFibo = parseInt(data.nickname.split('-').pop()) + 1;

            res.status(200).send({
                status: res.statusCode,
                message: 'Success',
                data: data.nickname
            })

            await data.update({
                nickname: `${req.body.nickname}-${lastFibo}`,
                updatedAt: Date.now(),
            });
            return
        }

        if (data.nickname.split('-').pop() > 1) {
            var lastFibo = parseInt(data.nickname.split('-').pop()) + 1;
            var nextFibo = fibonacci(lastFibo);

            res.status(200).send({
                status: res.statusCode,
                message: 'Success',
                data: `${data.nickname.split('-')[0]}-${nextFibo}`
            })

            await data.update({
                nickname: `${req.body.nickname}-${lastFibo}`,
                updatedAt: Date.now(),
            });
            return
        }

    } catch (e) {
        console.log(e.message);
        res.status(400).send({
            status: res.statusCode,
            message: e.message
        })
    }
}

module.exports = {
    catchPokemon,
    addPokemon,
    getMyPokemonList,
    releasePokemon,
    renamePokemon
}