const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Constant-time comparison — protects against timing attacks
function safeEqual(a, b) {
  const bufA = Buffer.alloc(256, 0);
  const bufB = Buffer.alloc(256, 0);
  bufA.write(String(a));
  bufB.write(String(b));
  return crypto.timingSafeEqual(bufA, bufB);
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  const usernameOk = safeEqual(username, process.env.ADMIN_USERNAME);
  const passwordOk = safeEqual(password, process.env.ADMIN_PASSWORD);

  if (!usernameOk || !passwordOk) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token });
});

module.exports = router;
