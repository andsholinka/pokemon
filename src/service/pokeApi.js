var axios = require('axios');

let security = {

    getImage: (req, res, name) => {
        return new Promise((resolve, reject) => {
            try {
                var config = {
                    method: 'get',
                    url: 'https://pokeapi.co/api/v2/pokemon/' + name,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                axios(config)
                    .then(function (response) {
                        resolve(response.data.sprites.front_default);
                    })
                    .catch(function (error) {
                        console.log('=========error=========');
                        res.status(400).send({
                            'status': res.statusCode,
                            'message': '[ERROR] API Get Image Pokemon'
                        });
                    });
            } catch (err) {
                res.status(500).send({
                    "code": 100,
                    "msg": err
                })
            }
        })
    },

    getType: (req, res, name) => {
        return new Promise((resolve, reject) => {
            try {
                var config = {
                    method: 'get',
                    url: 'https://pokeapi.co/api/v2/pokemon/' + name,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                axios(config)
                    .then(function (response) {
                        resolve(response.data.types.map((type) => type.type.name).join(', '));
                    })
                    .catch(function (error) {
                        console.log('=========error=========');
                        res.status(400).send({
                            'status': res.statusCode,
                            'message': '[ERROR] API Get Type Pokemon'
                        });
                    });
            } catch (err) {
                res.status(500).send({
                    "code": 100,
                    "msg": err
                })
            }
        })
    },

    getMove: (req, res, name) => {
        return new Promise((resolve, reject) => {
            try {
                var config = {
                    method: 'get',
                    url: 'https://pokeapi.co/api/v2/pokemon/' + name,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                axios(config)
                    .then(function (response) {
                        resolve(response.data.moves.map((move) => move.move.name).join(', '));
                    })
                    .catch(function (error) {
                        console.log('=========error=========');
                        res.status(400).send({
                            'status': res.statusCode,
                            'message': '[ERROR] API Get Move Pokemon'
                        });
                    });
            } catch (err) {
                res.status(500).send({
                    "code": 100,
                    "msg": err
                })
            }
        })
    },
}

module.exports = security;