const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../server/middlewares/auth');

/* GET home page. */
// @desc Login/Landing page
// @route GET /
router.get('/',  (req,res) =>  {
  res.set('Cache-Control', "no-cache='Set-Cookie, Set-Cookie2'");
  res.render('upload', {title: 'Upload Page'});
});
/*
// @desc Dasboard
// @route GET /dashboard
router.get('/upload',  async (req,res) => {
  try {
    res.render('upload', {title: 'Upload Page'}, {name: req.user.firstName});
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});
*/
module.exports = router;
