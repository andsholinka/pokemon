const express = require('express');
const pokemonController = require('../controllers/pokemon');

const router = express.Router();

router.get('/catchPokemon/:name', pokemonController.catchPokemon);

router.post('/addPokemon', pokemonController.addPokemon);

router.get('/myPokemonList', pokemonController.getMyPokemonList);

module.exports = router;