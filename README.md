[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iZes9Qfg)
# Exam #1: "Ultima Corsa"
## Student: s356980 STEFAN ANDREI DANIEL 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...





## API Server

### Login
[POST] `/api/sessions` - Create a new session (login). Returns user information + default routes +  

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
  "user": {
    "id": 2,
    "username": "andrei"
  },
  "routes": [
    {
      "line_name": "Linea Arancione",
      "station_id": 3,
      "station_name": "Qt8",
      "stop_sequence": 1
    },
    ...
  ]
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

### Start the game and get game information
[POST] `/api/games` - Create a new game.

Request body: None

Response: `201 Created` (success), `401 Unauthorized` (user not logged in), `500 Internal Server Error` (failure)

Response body: A JSON object containing with the id of the game and the selected start and end stations.
  ```json
  {
    "game_id": 43,
    "start_station_id": 4,
    "end_station_id": 1
  }
  ```


### Send the planned route for validation
[POST] `/api/games/:id/validate` - Send the planned route by the user. 

Request body: A JSON object containing the selected route.
  ```json
  {
    "path": [1, 2, 3, 4]
  }
  ```

Response: `200 OK` (success), `401 Unauthorized` (user not logged in), `403 Forbidden` (timeout) `500 Internal Server Error` (failure), `400 Bad Request` (start/end stations aren't the same), `404 Not Found` (if start time doesn't exists)

Response body: A JSON object containing the list associated events and final coins.
  ```json
  {
  "final_coins": 1,
  "events": [
    {
      "description": "Porte che continuano a riaprirsi",
      "effect": -1
    },
    ...
  ]
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
