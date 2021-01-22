# software-security-backend

You have reached the backend of my 'Software Security' assigment. This REST API serves all actions regarding the selling of Pokémon cards.

It is publically available at https://software-security-api.dknoops.xyz/

## API Resources

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
