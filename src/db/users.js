import { ObjectID } from 'mongodb';

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
      console.log(`Error in insertUser: ${e}`);
      throw e;
    }
  }

  static async listUsers() {
    try {
      return await users
        .find({})
        .project({ email: 1, name: 1 })
        .toArray();
    } catch (e) {
      console.log(`Error in listUsers: ${e}`);
      return [];
    }
  }

  static async getUser(id) {
    try {
      return await users.findOne({ _id: ObjectID(id) });
    } catch (e) {
      console.log(`Error in getUser: ${e}`);
      return null;
    }
  }

  static async getUserByEmail(email) {
    try {
      return await users.findOne({ email });
    } catch (e) {
      console.log(`Error in getUserByEmail: ${e}`);
      return null;
    }
  }

  static async updateUser(id, updateUser) {
    try {
      return await users.updateOne({ _id: ObjectID(id) }, { $set: updateUser });
    } catch (e) {
      console.log(`Error in updateUser: ${e}`);
      throw e;
    }
  }

  static async deleteUser(id) {
    try {
      return await users.deleteOne({ _id: ObjectID(id) });
    } catch (e) {
      console.log(`Error in deleteUser: ${e}`);
      throw e;
    }
  }
}

export default UserDB;
