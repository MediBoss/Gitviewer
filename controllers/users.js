const app = require('express')
const router = app.Router()
const User = require('../models/user')

// router.get("/new-user", function(request, response){
//   response.render('new-user')
// });
// 
// router.post("/users", function(request, response){
//   User.create(request.body)
//     .then( (user) => {
//       console.log(user)
//       response.redirect('https://www.github.com')
//     })
// })







module.exports = router
