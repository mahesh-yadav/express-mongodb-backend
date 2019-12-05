let db;
let users;

class UserDB {
  static async initializeDB(connection) {
    try {
      db = await connection.db(process.env.MONGODB_DATABASE);
      users = await db.collection('users');

      let count = await users.countDocuments();

      console.log('count: ', count);
    } catch (e) {
      console.error(`Unable to establish a collection handle for users: ${e}`);
    }
  }

  static async insertUser(user) {
    try {
      return await users.insertOne(user);
    } catch (e) {
      // MongoError: code: 11000 -duplicate error
      console.log(e);
      throw e;
    }
  }

  static async listUsers() {
    try {
      return await users
        .find({})
        .project({ email: 1, name: 1, _id: 0 })
        .toArray();
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export default UserDB;
