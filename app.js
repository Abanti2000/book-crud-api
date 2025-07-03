// import express from 'express';
// import authRoutes from './routes/auth.js';
// import bookRoutes from './routes/books.js';
// //import logger from './middleware/logger.js';
// import logger from './middlewares/logger.js';

// import errorHandler from './middlewares/errorHandler.js';

// const app = express();
// app.use(express.json());
// app.use(logger);

// app.use('/auth', authRoutes);
// app.use('/books', bookRoutes);

// app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
// app.use(errorHandler);

// app.listen(3000, () => console.log('Server running on port 3000'));

import express from 'express';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use(logger);

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
