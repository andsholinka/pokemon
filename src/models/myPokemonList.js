"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class myPokemonList extends Model {}
    myPokemonList.init({
        pokemon_name: DataTypes.STRING,
        nickname: DataTypes.STRING,
        fibonacci: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: "myPokemonList",
        paranoid: true,
    });
    return myPokemonList;
};