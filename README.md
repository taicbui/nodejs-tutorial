# Node.js/Express.js/PostgreSQL/JWT Authentication Tutorial

This project is a tutorial teaching the basics of building a secure authentication system using Node.js, Express.js, PostgreSQL, and JSON Web Tokens (JWT).

## Installation and Setup

Before you can run the server, you'll need to set up a PostgreSQL database and set the necessary environment variables. Here is how to do it:

1. Install PostgreSQL if you haven't already. You can download it from the official website [here](https://www.postgresql.org/download/).

2. Create a new PostgreSQL database and user. You can use the `createdb` and `createuser` commands to do this, or use a GUI tool like pgAdmin.

3. Set the following environment variables in a `.env` file or in your shell environment:

   ```
   DATABASE_URL=postgres://<username>:<password>@<hostname>:<port>/<database-name>
   JWT_SECRET=<your-jwt-secret>
   ```

   Replace `<username>`, `<password>`, `<hostname>`, `<port>`, and `<database-name>` with your PostgreSQL database credentials. Replace `<your-jwt-secret>` with a secret string used to sign your JWT tokens.

4. Install the dependencies:

   ```
   npm install
   ```

5. Build the server:
   ```
   npm run build
   ```

## Running the Server

To start the server in development mode with `nodemon`, run:

```
npm run dev
```

This will start the server and restart it automatically whenever you make changes to the source code.

To start the server in production mode, run:

```
npm start
```

This will start the server using the compiled JavaScript code in the `dist` directory.

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.
