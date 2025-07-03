import jwt from 'jsonwebtoken';

const SECRET = 'bookstore_secret';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decodedUser;
    next();
  });
};

export const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
