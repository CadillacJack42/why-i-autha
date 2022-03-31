const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  // TODO: Implement me!
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  });

  const { access_token } = await response.json();
  return access_token;
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
  const profile = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  const { avatar_url, login } = await profile.json();
  return { username: login, photoUrl: avatar_url };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
