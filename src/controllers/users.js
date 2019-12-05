import { validationResult } from 'express-validator';
import UserDB from '../db/users';
import { encryptPassword, makeSalt } from '../helpers/auth';

class UserControllers {
  static async createUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const salt = makeSalt();
    const hashedPassword = encryptPassword(password, salt);

    if (!hashedPassword) {
      return res.status(500).send('Internal server error');
    }

    const createdOn = Date.now();

    try {
      const { insertedId, insertedCount } = await UserDB.insertUser({
        name,
        email,
        hashedPassword,
        salt,
        createdOn,
      });
      res.status(200).json({
        insertedId,
        insertedCount,
      });
    } catch (e) {
      res.status(400).json({
        errors: [
          {
            value: req.body.email,
            msg: 'Email already in use',
            param: 'email',
            location: 'body',
          },
        ],
      });
    }
  }

  static async listUsers(req, res) {
    let result = await UserDB.listUsers();

    res.status(200).json(result);
  }

  static getUser(req, res, next) {}
  static updateUser(req, res, next) {}
  static deleteUser(req, res, next) {}
}

export default UserControllers;
