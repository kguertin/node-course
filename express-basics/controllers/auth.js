exports.getLogin = (req, res) => {
//   const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';
  console.log(req.session.isLoggedIn)
  res.render('auth/login',{
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.postLogin= (req, res) => {
  req.session.isLoggedIn = true
  res.redirect('/');
}