const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    // console.log(req.query);
    /*
      TODO:
     * get code
     * exchange code for token
     * get info from github about user with token
     * get existing user if there is one
     * if not, create one
     * create jwt
     * set cookie and redirect
     */
    try {
      const token = await exchangeCodeForToken(req.query.code);
      // console.log('TOKEN : ', token);
      const profileData = await getGithubProfile(token);
      // console.log('PROFILE DATA : ', profileData);
      let user = await GithubUser.findByUsername(profileData.login);

      if (!user)
        user = await GithubUser.insert(
          profileData.login,
          profileData.email,
          profileData.avatar_url
        );

      const signedUser = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      console.log(signedUser);

      res
        .cookie(process.env.COOKIE_NAME, signedUser, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1000,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next(error);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    console.log('USER : ', req.user);
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
