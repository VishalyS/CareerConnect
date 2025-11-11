# CareerConnect — Demo project

This repository contains a starter scaffold for CareerConnect (Node.js, Express, MongoDB) implementing five modules: User/Profile, Assessments, Training, Mentorship, and Jobs.

Quick start

1. Copy .env or set environment variables:

   - MONGO_URI (default: mongodb://127.0.0.1:27017/careerconnect)
   - JWT_SECRET (default used only for local/dev)

2. Install dependencies:

   npm install

3. Start the server (development):

   npm run dev

The app will serve a minimal demo UI at http://localhost:3000 and expose APIs under /api/\* .

Next steps

- Add validation and tests
- Harden auth and input sanitization
- Implement pagination, search and analytics for assessments
- Add role-based access control for admin/mentors

MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com and add a database user.
2. Whitelist your IP or allow access from anywhere for testing (not recommended for production).
3. Copy the connection string and set it in a `.env` file as `MONGO_URI`. Example (replace username/password and cluster host):

   MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerconnect?retryWrites=true&w=majority"

4. Start the server as above. The app will connect to Atlas if `MONGO_URI` is set.

Security note: Do not commit `.env` or secrets to source control. Use the `.env.example` as a template.

Simplified auth (basic project)

This starter uses a minimal, beginner-friendly auth approach (no JWTs or sessions):

- When a user registers or logs in, the server returns the user object `{ user: { id, name, email } }`.
- The frontend stores the user id in `localStorage` under `cc_user_id` and sends it in the `x-user-id` header for protected API calls.

This keeps the backend simple for learning. For production apps you should use secure, stateful sessions or JWTs + refresh tokens and follow security best practices.

Passwords stored as plain text (by request)

Per your request, this project stores passwords as plain text and compares them directly on login. This is insecure and should only be used for local learning/demos. Never store plain-text passwords in production. If you later want hashing, we can re-introduce bcrypt and hashed passwords.
