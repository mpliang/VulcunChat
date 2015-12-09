# Socket Chat Express Backend

## How to use
```
View the app here: https://vulcun-chat.herokuapp.com/
```
#### Features

```
Multi-user chat hosted on Heroku
Able to query entire database
Sends 1000 random messages every 5 seconds
Filters chat with 100 randomly selected words
Able to add 10 million random users (in theory)
```

#### Updates

1. after adding 150k users, heroku crashes
2. removed AWS EB, socket.io was not working well with that
3. changed number of random messages to 100 so lessen server load
4. Part 1 integrated
  - go to /users/:query to make a query
  - go to /addData to add 10 million users
  - go to /users to see total number of users

#### Tools used:
```
1. angular
2. node
3. express
4. chance & randomWords
5. async
6. socket.io
7. heroku
```
