const UserModel = require('../models/user.model')
const Token = require('../models/token.model')

class Auth {

  // Verify requestor is a currently valid account holder (user or admin)
  static isCurrent (req, res, next) {
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
    })
    .then(() => next()) // pass auth check
    .catch(next) // fail auth check
  }

  // Verify role is admin
  static isAdmin (req, res, next) {
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.role !== 'admin') throw new Error('unauthorizedUser')
    })
    .then(() => next()) // pass auth check
    .catch(next) // fail auth check
  }

  // Verify user owns the resource... only works with users table
  static isOwner (req, res, next) {
    const id = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify User
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.id != id) throw new Error('unauthorizedUser')
    })
    .then(() => next()) // pass auth check
    .catch(next) // fail auth check
  }

  // Verify admin or a user who owns the resource... only works with users table
  static isOwnerOrAdmin (req, res, next) {
    const id = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify User
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (!(user.role === 'admin' || (user.role === 'user' && user.id == id))) throw new Error('unauthorizedUser')
    })
    .then(() => next()) // pass auth check
    .catch(next) // fail auth check
  }

}

module.exports = Auth