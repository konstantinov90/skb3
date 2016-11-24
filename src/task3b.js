import express from 'express'
import _ from 'lodash'
import Pets from './load_pets_json'
const pets = new Pets()

const router = express.Router()

function compare(a,b) {
  if (a.id < b.id)
    return -1;
  if (a.id > b.id)
    return 1;
  return 0;
}

router.use(async (req, res, next) => {
  const data = await pets.getData()
  req.pets = data.pets
  req.users = data.users
  next()
})

function populatePet(pet, req) {
  pet.user = req.users.filter(u => u.id == pet.userId)[0]
}

function populateUser(user, req) {
  user.pets = req.pets.filter(p => user.id == p.userId)
}

router.use('/pets*',(req, res, next) => {
  req.pets.forEach(p => {populatePet(p, req)})
  next()
})

router.use('/users*',(req, res, next) => {
  req.users.forEach(u => {populateUser(u, req)})
  next()
})

router.use((req, res, next) => {
  const petType = req.query.type;
  const ageGT = req.query.age_gt;
  const ageLT = req.query.age_lt;
  const pet = req.query.havePet;
  if (pet) {
    req.pets.forEach(p => {populatePet(p, req)})
    const typePets = req.pets.filter(p => p.type == pet);
    req.users = []
    typePets.forEach(curPet => {
      // console.log(req.users.filter(u => u.id == curPet.userId))
      req.users = _.uniqBy(req.users.concat(curPet.user), (u) => u.id)
    })
    req.pets.forEach(p => delete p['user'])

  }
  if (petType)
    req.pets = req.pets.filter(p => p.type == petType)
  if (ageGT)
    req.pets = req.pets.filter(p => p.age > +ageGT)
  if (ageLT)
    req.pets = req.pets.filter(p => p.age < +ageLT)
  next()
})


router.get('/', async (req, res) => {
  res.send(await pets.getData())
})

router.get('/users', (req, res) => {
    res.send(req.users.map(u => _.omit(u,'pets')).sort(compare));
})

router.get('/users/populate', (req, res) => {
    req.pets.forEach(p => delete p['user'])
    res.send(req.users.sort(compare));
})

router.use('/users/:value*', (req, res, next) => {
  const value = req.params.value
  console.log(value)
  let key;
  if (+value == value)
    key = 'id';
  else if (typeof value == 'string' )
    key = 'username';
  req.user = req.users.filter(u => u[key] == value)[0];
  console.log(key, req.users.filter(u => u.username == 'blink'))
  if (! req.user)
    next(new Error('user not found'))
  else
    next()
})

router.get('/users/:value', (req, res) => {
  res.send(_.omit(req.user, 'pets'));
})
router.get('/users/:value/populate', (req, res) => {
  res.send(req.user);
})

router.get('/users/:value/pets', (req, res) => {
  console.log(req.pets, req.user)
  const userPets = req.pets.filter(p => p.userId == req.user.id)
  res.send(userPets.sort(compare));
})

router.get('/pets', (req, res) => {
  res.send(req.pets.map(p => _.omit(p, 'user')).sort(compare));
})





router.get('/pets/populate', (req, res) => {
  let pets = req.pets
  req.users.forEach(u => delete u['pets'])
  res.send(req.pets.sort(compare))
})

router.get('/pets/:id', (req, res, next) => {
  const pet = req.pets.filter(p => p.id == req.params.id).map(p => _.omit(p, 'user'))[0]
  if (!pet)
    next(new Error('pet not found'))
  else
    res.send(pet);
})

router.get('/pets/:id/populate', (req, res) => {
  res.send(req.pets.filter(p => p.id == req.params.id)[0]);
})

router.use((err, req, res, next) => {
  console.error(err)
  res.sendStatus(404);
})

export default router;
