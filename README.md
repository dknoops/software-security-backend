# software-security-backend

You have reached the backend of my 'Software Security' assigment. This REST API serves all actions regarding the selling of Pokémon cards.

It is publically available at https://software-security-api.dknoops.xyz/

## Frontend (Website)
### URI
https://www.dknoops.xyz/

### Repository
https://github.com/dknoops/software-security-web-application

## Toegangscontrole Policy (NL)

### Gebruikers

- Kaarten bekijken
- Nieuwe kaarten aanmaken
- Eigen kaarten aanpassen, verwijderen
- Eigen profiel/gegevens bekijken, aanpassen, verwijderen

### Beheerders

- Kaarten bekijken
- Kaarten verwijderen
- Eigen profiel/gegevens bekijken, aanpassen, verwijderen

## API Resources

### Origin
All resources are available from every origin, although most of the operations require you to be authenticated through the front end (https://www.dknoops.xyz/). Once authenticated, a Bearer Token will be generated to execute those calls. This way, the token serves as an API Key.

### / (root)

```
No authentication required
- OPTIONS
- GET
```

### /users

```
No authentication required
- OPTIONS

Authentication required
- POST
- PUT
- DELETE
```

### /me

```
No authentication required
- OPTIONS

 Authentication required
- GET
```

### /cards

```
No authentication required
- OPTIONS
- GET

Authentication required
- POST
```

### /user-cards

```
No authentication required
- OPTIONS

Authentication required
- GET
```

### /cards/{card_id}

```
No authentication required
- OPTIONS

Authentication required
- GET
- PUT
- DELETE
```

## Secrets
This application uses secrets such as Auth0 and Database credentials, which are all safeley stored inside a .env file thats is not included in this repository. 

## Measures against typical web vulnerabilities
### CSRF Mitigation
This application uses Auth0 as identity provider. Upon login, the users' accesstoken is kept in memory at all times without setting a cookie.

### SQL Injection
Incoming data is never concatenated in a SQL query. Instead, the data gets bound to SQL parameters.

## Dependabot
GitHub's Dependabot is ingeschakeld op deze repo zodat ik zo snel mogelijk op de hoogte wordt gebracht van nieuw ontdekte kwetsbaarheden in mijn dependencies.
