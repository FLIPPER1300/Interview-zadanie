# Phonebook – Angular frontend

Single-page app that signs the user in through Keycloak and lists / adds phone numbers.

## Local development

Requires Node.js 24.15+ and the rest of the stack running (`docker compose up` in the repo root).

```bash
npm install
npm start        # http://localhost:4200, /api is proxied to http://localhost:5225
npm test         # unit tests (Vitest)
```

When running `npm start`, stop the `frontend` container first (it uses the same port 4200):
`docker compose stop frontend`.
