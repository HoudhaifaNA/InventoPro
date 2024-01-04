import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

type TErrorController = (err: AppError, req: Request, res: Response, next?: NextFunction) => void;

const handleUniqueError = (err: AppError) => {
  const fieldsNames = err.message
    .split(':')[1]
    .split(' ')
    .map((field) => {
      if (field) return field.split('.')[1];
    });

  const message = `${fieldsNames.join(' ')} doivent être uniques`;

  return new AppError(message, 400);
};

const handleForeignKeyError = () => {
  let message = "Impossible d'effectuer cette action en raison d'un document associé";

  return new AppError(message, 403);
};

const handleNullError = (err: AppError) => {
  const fieldPath = err.message.split(':')[1];
  const fieldName = fieldPath.split('.')[1];
  let message = `Veuillez indiquer ${fieldName}`;

  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Jeton invalide. Veuillez vous reconnecter', 401);
};

const handleExpiredJWT = () => {
  return new AppError('Jeton a expiré. Veuillez vous reconnecter', 401);
};

//-------------------------//

const sendErroDev: TErrorController = (err, _req, res) => {
  console.log(`ERROR 🔥🔥 :  ${err}`);

  return res.status(err.statusCode).json({ status: err.status, err, message: err.message, stack: err.stack });
};

const sendErrorProd: TErrorController = (err, _req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ status: 'error', message: err.message });
  }

  console.log(`ERROR 🔥🔥 :  ${err.message}`);

  return res.status(err.statusCode).json({
    status: 'Quelque chose a mal tourné',
    message: 'Veuillez réessayer',
  });
};

const errorController: TErrorController = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErroDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.message.startsWith('UNIQUE')) error = handleUniqueError(err);
    if (error.message.startsWith('FOREIGN KEY')) error = handleForeignKeyError();
    if (error.message.startsWith('NOT NULL')) error = handleNullError(err);
    if (error.message.startsWith('JsonWebTokenError')) error = handleJWTError();
    if (error.message.startsWith('TokenExpiredError')) error = handleExpiredJWT();

    sendErrorProd(error, req, res);
  }
};

export default errorController;
