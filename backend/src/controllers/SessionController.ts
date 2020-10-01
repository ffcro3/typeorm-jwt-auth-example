import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getRepository, InsertQueryBuilder } from 'typeorm';

dotenv.config({ path: __dirname + '/.env' });

import User from '../app/models/User';

class SessionController {
  async index(req: Request, res: Response) {
    return res.send({ userId: req.userId });
  }

  async auth(req: Request, res: Response) {
    const repo = getRepository(User);

    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '')
      return res.status(400).json({
        error: 'you must provide all data to create an user',
      });

    const user = await repo.findOne({
      where: {
        email,
      },
    });

    if (!user)
      return res.status(401).json({
        error: 'user not found',
      });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({
        error: 'password invalid',
      });

    const token = jwt.sign({ id: user.id }, 'LLOREMIPSUM', {
      expiresIn: '1d',
    });

    delete user.password;

    return res.json({
      user,
      token,
    });
  }
}

export default new SessionController();
