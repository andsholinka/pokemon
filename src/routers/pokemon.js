const express = require('express');
const pokemonController = require('../controllers/pokemon');

const router = express.Router();

router.get('/catchPokemon/:name', pokemonController.catchPokemon);

router.post('/addPokemon', pokemonController.addPokemon);

router.get('/myPokemonList', pokemonController.getMyPokemonList);

router.delete("/releasePokemon/:id", pokemonController.releasePokemon);

module.exports = router;