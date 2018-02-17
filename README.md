# CoinDuel backend

Backend API repo for CoinDuel iOS app.

https://coinduel-cs98.herokuapp.com/api/user
^ send post endpoint with username to find if one exists
^ send delete request with usernamen to delete

https://coinduel-cs98.herokuapp.com/api/signup
^add user with a post request with email, password, and username

* Data models:

```
user: {
    user_id,
    email,
    password_hash,
    balance
},
coin: {
    id,
    name,
    symbol,
    market_cap_usd
},
coinPrices: {
    coin_id,
    price,
    date
},
capCoinHistory: {
    user_id,
    balance,
    date
},
game: {
    game_id,
    start_date,
    finish_date
},
gameLeaderboard: {
    game_id,
    user_id,
    percent_return,
    time_of_observation
},
gameUserChoices: {
    game_id,
    user_id,
    selections: {[selection_1, percent_mix,], ...,[selection_3, percent_mix]}
}
```
## Architecture

The backend is comprised of Node.js and Express for the server, and MongoDB for the database.

## Setup

1) clone backend repo
1.5) If necessary, get homebrew and download mongo using 'brew install mongodb'
2) 'brew services start mongodb' OR 'mongod' (if not using brew)
3) mongo < test_data.js 
4) npm install
5) npm run dev
6) To test, try http://localhost:9000/api/game. This should return the most recent game from test_data.js.
###### runs on port 9000

## Deployment

Heroku

## Authors

Kooshul Jhaveri, Anish Chadalavada, Mitchell Revers, Rajiv Ramaiah, Henry Wilson, Josh Kerber

## Acknowledgments

N/A
