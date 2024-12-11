import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: 'Invalid request syntax',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
};