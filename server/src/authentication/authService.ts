import { getRepository } from 'typeorm';
import { User } from './../database/entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import validator from 'validator';

// Validate password length and strength
export function validatePassword(password: string): boolean {
  return (
    validator.isLength(password, { min: 8 }) && // At least 8 chars long
    validator.matches(password, /[a-z]/) && // Contains at least one lowercase letter
    validator.matches(password, /[A-Z]/) && // Contains at least one uppercase letter
    validator.matches(password, /[0-9]/) && // Contains at least one number
    validator.matches(password, /[^a-zA-Z0-9]/) // Contains at least one symbol
  );
}

// The registerUser function is used to create a new user account
// It takes a userData object containing user information, create a new User entity and save it to the database
export async function registerUser(
  userData: Partial<User>
): Promise<User | string> {
  // Get the repository for the User entity
  const userRepository = getRepository(User);
  // Check if a user with the provided username already exists
  const existingUser = await userRepository.findOne({
    where: { username: userData.username },
  });
  if (existingUser) {
    return 'dublicate';
  }

  if (validatePassword(userData.password as string) === false) {
    return 'weak password';
  }
  // Create a new user entity using the user data passed in
  const newUser = userRepository.create(userData);
  // Save the user entity to the database
  await userRepository.save(newUser);
  return newUser;
}

// The loginUser function is used to authenticate a user and generate a JWT token for them.
// It takes a username and password, checks if the credentials are valid. If valid, return a JWT token. If not valid, return null.
export async function loginUser(
  username: string,
  password: string
): Promise<string | null> {
  // Get the repository for the User entity
  const userRepository = getRepository(User);

  // Find the user with provided username
  const user = await userRepository.findOne({ where: { username } });

  // If the user is not found, return null
  if (!user) {
    return null;
  }

  // Compare the provided password with the stored hashed password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // If the password is not valid, return null
  if (!isPasswordValid) {
    return null;
  }

  // Get the JWT Secret from .env
  const jwtSecret = process.env.JWT_SECRET || 'jwtsecret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  // Generate a JWT token, including the user's id and username in payload
  const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, {
    expiresIn: expiresIn,
  });

  // return the generated token
  return token;
}
