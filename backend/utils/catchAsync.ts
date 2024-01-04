import { NextFunction, Response, Request } from 'express';

type Middlware = (req: Request, res: Response, next: NextFunction) => void;

const catchAsync = (fn: Middlware) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
