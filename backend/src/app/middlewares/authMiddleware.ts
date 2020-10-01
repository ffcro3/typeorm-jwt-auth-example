import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface Itoken {
  id: string;
  iat: number;
  exp: number;
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({
      error: 'Token not provided',
    });

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = await jwt.verify(token, 'LLOREMIPSUM');
    const { id } = data as Itoken;

    req.userId = id;

    return next();
  } catch {
    if (!authorization)
      return res.status(401).json({
        error: 'Token Invalid',
      });
  }
}
