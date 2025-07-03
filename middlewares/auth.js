// import jwt from 'jsonwebtoken';
// const SECRET = 'bookstore_secret';


// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Forbidden' });
//     req.user = user;
//     next();
//   });
// };

// export const generateToken = (user) => jwt.sign(user, SECRET, { expiresIn: '1h' });


import jwt from 'jsonwebtoken';

const SECRET = 'bookstore_secret';

// Middleware to authenticate JWT
export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if Authorization header exists and starts with Bearer
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

// Function to generate JWT
export const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
