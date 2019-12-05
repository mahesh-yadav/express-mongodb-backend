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
      if (e.code === 11000) {
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
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }

  static async listUsers(req, res) {
    let result = await UserDB.listUsers();

    res.status(200).json(result);
  }

  static async getUser(req, res) {
    let user = await UserDB.getUser(req.params.userId);

    if (user) {
      const { name, email, createdOn, updatedOn, _id } = user;
      return res.status(200).json({
        name,
        _id,
        email,
        createdOn,
        updatedOn,
      });
    }

    return res.status(200).json({});
  }

  static async updateUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, password } = req.body;

    const salt = makeSalt();
    const hashedPassword = encryptPassword(password, salt);

    if (!hashedPassword) {
      return res.status(500).send('Internal server error');
    }

    const updatedOn = Date.now();

    try {
      let { modifiedCount } = await UserDB.updateUser(req.params.userId, {
        name,
        hashedPassword,
        salt,
        updatedOn,
      });

      if (modifiedCount === 1) {
        let user = await UserDB.getUser(req.params.userId);

        if (user) {
          const { name, email, createdOn, updatedOn, _id } = user;
          return res.status(200).json({
            name,
            _id,
            email,
            createdOn,
            updatedOn,
          });
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      res.status(500).send('Internal Server Error');
    }
  }

  static async deleteUser(req, res) {
    try {
      let { deletedCount } = await UserDB.deleteUser(req.params.userId);

      res.status(200).json({
        deletedCount,
      });
    } catch (e) {
      res.status(500).send('Internal server error');
    }
  }
}

export default UserControllers;
