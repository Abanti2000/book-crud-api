// // middleware/logger.js
// export default function logger(req, res, next) {
//   console.log(`${req.method} ${req.path}`);
//   next();
// }

// middleware/logger.js
export default function logger(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}
