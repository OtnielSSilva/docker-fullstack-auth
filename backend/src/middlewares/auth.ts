import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!JWT_SECRET) {
    return res.sendStatus(500).send({ error: 'Not a valid JWT key' });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: any, user: string | jwt.JwtPayload | undefined) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    }
  );
}

export default authenticateToken;
