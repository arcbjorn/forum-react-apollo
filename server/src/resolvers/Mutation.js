const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, { url, description }, context) {
  const userId = getUserId(context)
  return context.prisma.createPost({
    url,
    description,
    postedBy: {
      connect: {
        id: userId
      }
    }
  })
}

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

async function vote(parent, args, context) {
  const userId = getUserId(context)
  const postExists = await context.prisma.$exists.vote({
    user: { id: userId },
    post: { id: args.postId },
  })
  if (postExists) {
    throw new Error(`Already voted for post: ${args.postId}`)
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    post: { connect: { id: args.postId } },
  })
}

module.exports = {
  post,
  signup,
  login,
  vote,
}
