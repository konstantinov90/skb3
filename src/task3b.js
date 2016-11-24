import express from 'express'
import _ from 'lodash'
import Pets from './petsJSONLoader'
const pets = new Pets()

const router = express.Router()

router.use(async (req, res, next) => {
  const data = await pets.getData()
  req.pets = data.pets
  req.users = data.users

  req.petsPopulated = getPopulatedPets(req.pets, req.users)
  req.usersPopulated = getPopulatedUsers(req.users, req.pets)
  next()
})

function compare(a,b) {return a.id < b.id? -1: a.id > b.id? 1: 0}

function getPopulatedPets(pets, users) {
  const petsPopulated =  _.cloneDeep(pets)
  petsPopulated.map(p => {
    const usr = users.filter(u => u.id == p.userId)
    p.user = usr.length? usr[0]: null
  })
  return petsPopulated
}

function getPopulatedUsers(users, pets) {
  const usersPopulated = _.cloneDeep(users)
  usersPopulated.map(u => {
    u.pets = pets.filter(p => u.id == p.userId).sort(compare)
  })
  return usersPopulated
}

router.use('/users*', (req, res, next) => {
  const pet = req.query.havePet;
  if (pet) {
    const typePets = req.petsPopulated.filter(p => p.type == pet);
    req.users = []
    typePets.forEach(curPet => {
      req.users = req.users.concat(curPet.user)
    })
    req.users = _.uniqBy(req.users, u => u.id)
    req.usersPopulated = getPopulatedUsers(req.users, req.pets)
  }
  next()
})

router.use('/pets*', (req, res, next) => {
  const petType = req.query.type;
  const ageGT = req.query.age_gt;
  const ageLT = req.query.age_lt;
  if (petType) {
    req.pets = req.pets.filter(p => p.type == petType)
    req.petsPopulated = req.petsPopulated.filter(p => p.type == petType)
  }
  if (ageGT) {
    req.pets = req.pets.filter(p => p.age > +ageGT)
    req.petsPopulated = req.petsPopulated.filter(p => p.age > +ageGT)
  }
  if (ageLT) {
    req.pets = req.pets.filter(p => p.age < +ageLT)
    req.petsPopulated = req.petsPopulated.filter(p => p.age < +ageLT)
  }
  next()
})

router.use((req, res, next) => {
  req.users = req.users.sort(compare)
  req.usersPopulated = req.usersPopulated.sort(compare)
  req.pets = req.pets.sort(compare)
  req.petsPopulated = req.petsPopulated.sort(compare)
  next()
})

router.get('/', async (req, res) => {
  res.send(await pets.getData())
})


router.get('/users', (req, res) => {
    res.send(req.users);
})

router.get('/users/populate', (req, res) => {
    res.send(req.usersPopulated);
})


router.use('/users/:value*', (req, res, next) => {
  const value = req.params.value
  let key;

  if (+value == value)
    key = 'id';
  else
    key = 'username';
  req.users = req.users.filter(u => u[key] == value)[0];
  req.usersPopulated = req.usersPopulated.filter(u => u[key] == value)[0];
  if (!req.users)
    next(new Error('user not found'))
  else
    next()
})

router.get('/users/:value', (req, res) => {
  res.send(req.users);
})

router.get('/users/:value/populate', (req, res) => {
  res.send(req.usersPopulated);
})

router.get('/users/:value/pets', (req, res) => {
  res.send(req.usersPopulated.pets);
})


router.get('/pets', (req, res) => {
  res.send(req.pets);
})

router.get('/pets/populate', (req, res) => {
  res.send(req.petsPopulated)
})

router.use('/pets/:id*', (req, res, next) => {
  req.pets = req.pets.filter(p => p.id == req.params.id)[0]
  req.petsPopulated = req.petsPopulated.filter(p => p.id == req.params.id)[0]
  if (!req.pets)
    next(new Error('pet not found'))
  else
    next()
})

router.get('/pets/:id', (req, res, next) => {
  res.send(req.pets);
})

router.get('/pets/:id/populate', (req, res) => {
  res.send(req.petsPopulated);
})

router.use((err, req, res, next) => {
  console.error(err)
  res.sendStatus(404);
})

export default router;
