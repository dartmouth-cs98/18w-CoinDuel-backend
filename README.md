# CoinDuel backend

Backend API repo for CoinDuel iOS app.

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
    percent_return
},
gameUserChoices: {
    game_id,
    user_id,
    selections: {[selection_1, is_short,], ...,[selection_3, is_short]}
}
```
## Architecture

The backend is comprised of Node.js and Express for the server, and MongoDB for the database.

## Setup

npm install; npm run dev
###### runs on port 8888

## Deployment

Heroku

## Authors

Kooshul Jhaveri, Anish Chadalavada, Mitchell Revers, Rajiv Ramaiah, Henry Wilson, Josh Kerber

## Acknowledgments

N/A
