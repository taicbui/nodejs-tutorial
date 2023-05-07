/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users. Can be called by any authenticated user.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Register a new user
 *     description: Register a new user. Can be called by any unauthenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       500:
 *         description: Error registering user
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: Log in a user. Returns a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jwtToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in user
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - age
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user.
 *         firstName:
 *           type: string
 *           description: The first name of the user.
 *         lastName:
 *           type: string
 *           description: The last name of the user.
 *         age:
 *           type: integer
 *           description: The age of the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *       example:
 *         id: 1
 *         firstName: John
 *         lastName: Doe
 *         age: 30
 *         username: johndoe
 *         password: secret123
 */

import { Router, Request, Response } from 'express';
import { User } from '../database/entities/User';
import { registerUser, loginUser } from './../authentication/authService';

const userRouter = Router();
// Register route
userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, age, username, password } = req.body;

    // Ceate a new user
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.username = username;
    user.password = password;

    const newUser = await registerUser(user);
    if (newUser === 'dublicate') {
      return res.status(409).json({ message: 'User already exists' });
    } else if (newUser === 'weak password') {
      return res.status(409).json({ message: 'Password is too weak' });
    } else {
      // Send a response
      return res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login route
userRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const jwtToken = await loginUser(username, password);
    if (jwtToken === null) {
      return res.status(401).json({ message: 'Invalid credentials' });
    } else {
      // Send a response
      return res
        .status(200)
        .json({ message: 'User logged in successfully', jwtToken });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in user', error });
  }
});

export default userRouter;
