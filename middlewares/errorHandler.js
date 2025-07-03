// export default (err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: 'Internal Server Error' });
// };

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
