import app from './app';
import { MongoClient } from 'mongodb';
import UserDB from './db/users';

const PORT = process.env.PORT || 4000;

const connection = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .connect()
  .then(async (connection) => {
    console.log('Connected to Database....');

    await UserDB.initializeDB(connection);

    app.listen(PORT, () => {
      console.log(`Server running at localhost:${PORT}.....`);
    });
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB Server', err);
  });

process.on('SIGINT', async () => {
  try {
    await connection.close();
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(1);
  }
});
