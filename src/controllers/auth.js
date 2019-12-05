require('dotenv').config();
import { validationResult } from 'express-validator';
import { authenticate } from '../helpers/auth';
import UserDB from '../db/users';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';

class AuthControllers {
  static async signin(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      let user = await UserDB.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          errors: {
            value: email,
            msg: 'User does not exist',
            param: 'email',
          },
        });
      }

      if (!authenticate(password, user.hashedPassword, user.salt)) {
        return res.status(401).json({
          value: password,
          msg: 'Password does not match',
          param: 'password',
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        token,
        _id: user._id,
      });
    } catch (e) {
      res.status(500).send('Internal Server Error');
    }
  }
}

export const hasAuthorization = (req, res, next) => {
  const isAuthorized =
    req.params.userId && req.auth && req.params.userId === req.auth._id;

  if (!isAuthorized) {
    return res.status(403).json({
      errros: {
        value: req.params.userId,
        msg: 'User is not authorised',
        param: 'userId',
      },
    });
  }

  next();
};

export const requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
});

export default AuthControllers;
