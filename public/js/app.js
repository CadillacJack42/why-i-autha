/* eslint-disable */

fetch('/api/v1/github/verify')
  .then((res) => {
    if (res.ok) return res.json();
    else throw new Error('Not logged in');
  })
  .then((user) => {
    // is logged in
    renderIsLoggedIn(user);
  })
  .catch(() => {
    // not logged in
    const button = document.createElement('button');
    button.textContent = 'Login with GitHub';
    button.addEventListener('click', () => {
      window.location.assign('/api/v1/github/login');
    });

    document.getElementById('root').appendChild(button);
  });

function renderIsLoggedIn(user) {
  const root = document.getElementById('root');
  const p = document.createElement('p');
  p.textContent = user.username;
  root.appendChild(p);

  const form = document.createElement('form');
  const textarea = document.createElement('textarea');
  textarea.name = 'text';

  const button = document.createElement('button');
  button.textContent = 'Create Tweet';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fd = new FormData(event.target);
    const text = fd.get('text');

    fetch('/api/v1/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, username: 'test_user' }),
    });
  });

  form.appendChild(textarea);
  form.appendChild(button);

  root.appendChild(form);
}
