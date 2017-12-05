const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    console.log('snacks model')
    return db('snacks')
  }

  static getOne (id) {
    return db('snacks')
    .where({id})
    .first()
  }

  static update (id, body) {
    return db('snacks')
    .where({id})
    .update({name: body.name, description: body.description})
    .returning('*')
  }

  static destroy (id) {
    return db('snacks')
    .where({id})
    .del()
    .returning('*')
  }
}

module.exports = snackModel
