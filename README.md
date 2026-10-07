# Phonebook – .NET 10 · Angular · Keycloak · PostgreSQL

Jednoduchá full-stack aplikácia na správu telefónnych čísel.

- Po prihlásení (Keycloak) používateľ vidí zoznam telefónnych čísel.
- Čísla je možné **len pridávať a prezerať** (žiadna úprava ani mazanie).
- Pri pridaní sa volí viditeľnosť:
  - **Osobný zoznam** – číslo vidí len jeho autor,
  - **Spoločný zoznam** – číslo vidia všetci prihlásení používatelia.

## Rýchly štart

```bash
docker compose up
```

_(Podrobnosti doplníme po dokončení jednotlivých častí.)_

## Architektúra

| Služba     | Technológia      | Úloha                                        |
|------------|------------------|----------------------------------------------|
| `postgres` | PostgreSQL       | Dáta pre Keycloak aj aplikáciu               |
| `keycloak` | Keycloak         | Prihlásenie používateľov, vydávanie tokenov  |
| `backend`  | .NET 10 Web API  | REST API pre telefónne čísla                 |
| `frontend` | Angular + nginx  | Používateľské rozhranie                      |
