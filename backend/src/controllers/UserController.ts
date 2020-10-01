import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../app/models/User';

class UserController {
  async store(req: Request, res: Response) {
    const repo = getRepository(User);

    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '')
      return res.status(400).json({
        error: 'you must provide all data to create an user',
      });

    const userExists = await repo.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    const user = await repo.create({ email, password });
    await repo.save(user);

    return res.status(200).json(user);
  }
}

export default new UserController();
