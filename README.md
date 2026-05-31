[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iZes9Qfg)
# Exam #1: "Ultima Corsa"
## Student: s356980 STEFAN ANDREI DANIEL 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...





## API Server

### Login
[POST] `/api/sessions` - Create a new session (login).

Request body: A JSON object with username and password
  ```json
  {
    "username" : "andrei",
    "password" : "andreipsw"
  }
  ```

Response: `201 Created` (success), `401 Unauthorized` (invalid credentials). 

Response body: A JSON object containing the username and the related id.
  ```json
  {
    "id": 1,
    "username": "andrei",
  }
  ```

### Check if still logged in
[GET] `/api/sessions/current` - Check if the user is still logged in

Request body: None

Response: `200 OK` (success), `401 Unauthorized` (Not authenticated). 

Response body: A JSON object containing the username and the related id.
  ```json
  {
    "id" : 1,
    "username": "andrei",
  }
  ```


### Logout
[DELETE] `/api/sessions/current` - Delete the current session (logout)
Request body: None

Response: `200 OK` (success) 

Response body: None



### List all the events
[GET] `/api/events` - List the events for the gameplay.

Request body: None

Response: `200 OK` (success), `401 Unauthorized` (user not logged in)

Response body: A JSON object containing the list of the events.
  ```json
  [
    {
      // "event_id": 1,
      "description": "Lorem ipsum",
      "effect": -2
    },
    ...
  ]
  ```


### List all the routes
[GET] `/api/routes` - List all the routes.

Request body: None

Response: `200 OK` (success), `500 Internal Server Error` (failure), `401 Unauthorized` (user not logged in)

Response body: A JSON object containing the list of the routes.
  ```json
  [
    {
      // "route_id": 1,
      "line_name": "Linea Rossa",
      "station_id": 5,
      "station_name": "Centrale",
      "stop_sequence": 2
    },
    ...
  ]
  ```

### Send the builded route (TODO)
[POST] `/api/routes` - Send the builded route by the user. 


Request body: A JSON object containing the selected route and the timer.
  ```json
  [
    {
      "line_name": "Linea Rossa",
      "station_id": 5,
      "station_name": "Centrale",
      "stop_sequence": 2
    },
    {
      "line_name": "Linea Rossa",
      "station_id": 6,
      "station_name": "QT8",
      "stop_sequence": 3
    },
    ...
  ]
  ```

Response: `200 OK` (success), `401 Unauthorized` (user not logged in), `TODO` (start/end stations are different from the assigned one even if time is ended)

Response body: A JSON object containing the list of the routes.
  ```json
  {
    "final_coins": 4,
  }
  ```









## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
