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

module.exports = {
    catchPokemon
}