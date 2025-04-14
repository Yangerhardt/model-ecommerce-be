import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload | string;
//     }
//   }
// }

// Verifica se o IP ou DOMÍNIO do usuário está na whitelist
// Talvez tenhamos alguns problemas com a questão de whitelist, mas isso pode ser testado.
export const whitelistMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allowedIPs = (process.env.ALLOWED_IPS as string)?.split(',');
  const allowedDomains = (process.env.ALLOWED_DOMAINS as string)?.split(',');
  const ip = req.ip;
  let origin = req.get('origin') || req.get('referer') || req.get('host');
  if (origin && !origin.startsWith('http')) {
    origin = `http://${origin}`;
  }

  if (!allowedIPs.includes('::1')) {
    allowedIPs.push('::1');
  }

  if (ip && !allowedIPs.includes(ip)) {
    console.error('Dennied access for ip: ', ip);
    return res.status(403).send('Unauthorized access');
  }

  if (origin) {
    const isOriginAllowed = allowedDomains.some((domain) =>
      origin.startsWith(domain),
    );
    if (!isOriginAllowed) {
      return res.status(403).send('Unauthorized access');
    }
  }

  next();
};

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: 'Authentication token not provided.' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token.' });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// const validateToken = (req: Request, res: Response) => {
//   let user = req.user;

//   if (typeof user === 'string') {
//     try {
//       const decoded = jwt.verify(
//         user,
//         process.env.JWT_SECRET || '',
//       ) as JwtPayload;
//       req.user = decoded;
//       user = decoded;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return res.status(403).json({ message: 'Invalid or expired token.' });
//     }
//   }
//   return user;
// };

// Verifica se o token não está na blacklist que é criada quando o usuário faz logout
// export const checkTokenBlacklist = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (token) {
//     const isBlacklisted = await redisClient.get(token);
//     if (isBlacklisted) {
//       return res.status(401).json({ message: 'Token has been invalidated' });
//     }
//   }

//   next();
// };

// export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
//   const user = validateToken(req, res);

//   if (
//     !user ||
//     typeof user !== 'object' ||
//     !('role' in user) ||
//     user.role !== 'admin'
//   ) {
//     return res.status(403).json({ message: 'Unauthorized' });
//   }

//   next();
// };

// Autoriza usuários aos endpoints caso eles estejam como ADMIN ou caso seja o  próprio usuário fazendo a requisição logado
// export const authorizeResourceAccess = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const user = validateToken(req, res);

//   if (!user || typeof user !== 'object' || !('id' in user)) {
//     res.status(403).json({ message: 'Unauthorized' });
//     return;
//   }

//   const resourceId = req.params.id;
//   const isAdmin: boolean = user && user.role === 'admin';
//   const hasTheSameId = user && user.id === resourceId;

//   if (isAdmin || hasTheSameId) {
//     next();
//   } else {
//     res.status(403).json({ message: 'Unauthorized' });
//   }
// };
