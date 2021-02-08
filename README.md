# Ticket System

A small project for practicing fullstack development from scratch.

#### Available Functions
- Sign in, sign up and user management.
- Event management.
- Session management.
- Ticket management.
- Book ticket.

## Tech Stack

- Frontend: React, Webpack
- Backend: Node, Express
- Database: MySQL, Redis

## Project Structure

### Backend

- `./` The backend service root folder.
- `./bin/www` The entry point for the backend service with pre-initialization.
- `./app.js` The entry point for the backend service after executing pre-initialization.
- `./config/` Make sure to set up the configs to match your local settings before starting the service.
- `./routes/` All backend routes are stored in here. These routes are referenced from `app.js`.
- `./middlewares/` Middlewares placed between routes and controllers are placed in here. `MySQL` and `Redis` connections are also designed as middlewares which will be instantiated only once during the service starts, and carrying those connections to the controllers within every request.
- `./controllers/` The main business logics folder.
- `./models/` All SQL operations that will exchange data with the database.
- `./utils/` Some extra helper functions that will be used across the project.
- `./sql/` DDL for re-creating the database structure.


### Frontend

- `./frontend/` The fronatend service root folder. All frontend files are stored in `frontend` the folder.
- `./frontend/src/index.jsx` The frontend service entry point.
- `./frontend/config/` Some frontend configurations.
- `./frontend/src/domain` Components inside this domain folder are the "page frames" that will be used directly by the React router. These components will then import other sub-components from their own folder.
- `./frontend/src/commons` If some components are used over twice, they will be placed here to share across the project.
- `./frontend/src/utils` Some helper functions shared across the project is located in here.

## Usage

#### Build frontend service into SPA

```
cd PROJECT_ROOT/frontend/
npm install
npm run build
```

You can then get an `index.html` along with a `bundle.js` file. Host it with Apache or Nginx or any other web server you want.

#### Run backend service

```
cd PROJECT_ROOT/
npm install
npm run start
```

The backend service will start running.
