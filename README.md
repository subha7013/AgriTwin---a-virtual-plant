# AgriTwin - a virtual plant

AgriTwin is a tomato plant monitoring platform (digital twin).

## Repository layout

```
AgriTwin---a-virtual-plant/
├── backend/     Node.js + Express + MongoDB API
├── frontend/    React + Vite dashboard
└── ml/          Tomato leaf dataset + training 
```

## Running the backend


### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create the environment file

Copy the .env file and paste there

### 4. Seed the database

```bash
npm run seed
```

Seeds the 10 tomato disease categories and one admin user.

Default admin login

- Username: `admin`
- Password: `Admin@123`

### 5. Start the API

```bash
npm run dev      # with auto-reload (nodemon)
```

The API runs at `http://localhost:5000`.

Check it is alive:

```
GET http://localhost:5000/api/v1/health
```


## Running the Frontend

The dashboard consumes this API. To run it:

```bash
cd frontend
npm install
npm run dev
```

It defaults to `http://localhost:5000/api/v1`

## Notes

- All routes above were verified end to end (auth, plants, diseases, ownership checks, validation and 404/401/403 responses).
- Refresh tokens are rotated on every refresh and revoked on logout.
