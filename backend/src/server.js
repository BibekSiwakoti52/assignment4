require('dotenv').config();
const app = require('./app');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log(err);
    console.log('Error while connecting to the database');
  });

// initialize the express server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection. Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
