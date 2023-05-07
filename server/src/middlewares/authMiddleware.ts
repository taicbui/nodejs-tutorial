import { Response, NextFunction } from 'express';
import { CustomRequest } from 'src/types/CustomRequest';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWTUserPayload } from 'src/types/JWTUserPayload';

// Type guard to check if the decoded value is of JwtPayload type
function isJwtPayload(decoded: string | JwtPayload): decoded is JWTUserPayload {
  return (decoded as JwtPayload).id !== undefined;
}

function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  // Get the Authorization header value
  const authHeader = req.headers.authorization;

  // If the Authorization header is not present, send a 401 Unauthorized response
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the JWT token from the Authorization header (format: "Bearer <token>")
  const token = authHeader.split(' ')[1];
  try {
    // Verify the JWT token using the JWT_SECRET from .env
    const jwtSecret = process.env.JWT_SECRET || 'jwtsecret';
    const decoded = jwt.verify(token, jwtSecret);

    if (isJwtPayload(decoded)) {
      // Store the decoded JWT payload (containing the user ID and username) in the request object
      req.user = decoded;
      // Proceed to the next middleware or route handler
      next();
      return;
    } else {
      // If the decoded value is not of JwtPayload type, send a 401 Unauthorized response
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    // If the JWT token is invalid, send a 401 Unauthorized response
    return res.status(401).json({ message: 'Invalid or Expired token' });
  }
}

export default authMiddleware;
