const express = require('express');
const pokemonController = require('../controllers/pokemon');

const router = express.Router();

router.get('/catchPokemon/:name', pokemonController.catchPokemon);

router.post('/addPokemon', pokemonController.addPokemon);

module.exports = router;