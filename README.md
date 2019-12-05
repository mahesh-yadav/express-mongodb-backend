The backend is a standalone server-side application that can handle HTTP requests to create a user, list all users, and view, update, or delete a user in the database.

The app also provides authentication and authorization using `jsonwebtoken` and `express-jwt` modules. The API endpoints to view, update, or delete a user are protected using JSON Web Token based authotization.

## **Tech stack**

- Node.js
- Express.js
- MongoDB

### **How to run the project**

1. Replace MONGODB*URI in *.env\_ file with the url of your own MongoDb server.
2. Run `yarn install`. This will add project dependencies.
3. Run `yarn compile`. This will transpile code using babel to be able to run in current node version (The app was developed on node version: 10.16.1)
4. Run `yarn start`. This will start the server at localhost:4000
