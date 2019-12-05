import app from './app';
import { MongoClient } from 'mongodb';

const PORT = process.env.PORT || 4000;

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then((client) => {
    console.log('Connected to Database....');

    app.listen(PORT, () => {
      console.log(`Server running at localhost:${PORT}.....`);
    });
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB Server', err.message);
  });

process.on('SIGINT', async () => {
  try {
    await client.close();
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(1);
  }
});
