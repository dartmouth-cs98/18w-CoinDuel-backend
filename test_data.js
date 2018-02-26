// Script for clearing out the local coinduel database and inserting test data
// To run this script, execute the command: 'mongo < test_data.js'

use coinduel
db.getCollectionNames().forEach(
  function(collection_name) {
    if(collection_name != 'system.indexes') {
      db[collection_name].remove({})
    }
  }
);

db.users.insertMany([
	{ _id: new ObjectId("5a8607d4971c50fbf29726a2"), email: '1@gmail.com', username: 'p1', password: '1', coinBalance: 0 },
	{ _id: new ObjectId("5a8607d5971c50fbf29726a3"), email: '2@gmail.com', username: 'p2', password: '2', coinBalance: 10 },
	{ _id: new ObjectId("5a8607d6971c50fbf29726a4"), email: '3@gmail.com', username: 'p3', password: '3', coinBalance: 30 },
	{ _id: new ObjectId("5a8607d6971c50fbf29726a5"), email: '4@gmail.com', username: 'p4', password: '4', coinBalance: 40 }])

db.games.insertMany([
  { _id: new ObjectId("5a8608233d378876bf62d819"), start_date: new Date(1519048800000), finish_date: new Date(1519423200000), "coins": [ {"name":"BTC", "value": 11129}, {"name": "ETH", "value": 973.93}, {"name": "XRP", "value": 1.05}, {"name": "BCH", "value": 1527.79}, {"name": "LTC", "value": 218.82}] } ])


db.entries.insertMany([
  { _id: new ObjectId("5a8ace5a53bb81002573c1f0"), gameId: new ObjectId("5a8608233d378876bf62d819"), userId: new ObjectId("5a8607d6971c50fbf29726a4"), coin_balance: 8.4, choices: [ {"symbol": "BTC", "allocation": 1.0}, {"symbol": "ETH", "allocation": 1.0}, {"symbol": "XRP", "allocation": 2.0}, {"symbol": "BCH", "allocation": 2.0}, {"symbol": "LTC", "allocation": 4.0} ] },
  { _id: new ObjectId("5a8ace5a53bb81002573c1f1"), gameId: new ObjectId("5a8608233d378876bf62d819"), userId: new ObjectId("5a8607d4971c50fbf29726a2"), coin_balance: 3.9, choices: [ {"symbol": "BTC", "allocation": 1.0}, {"symbol": "ETH", "allocation": 1.0}, {"symbol": "XRP", "allocation": 2.0}, {"symbol": "BCH", "allocation": 2.0}, {"symbol": "LTC", "allocation": 4.0} ] },
  { _id: new ObjectId("5a8ace5a53bb12302573c1f2"), gameId: new ObjectId("5a8608233d378876bf62d819"), userId: new ObjectId("5a8607d5971c50fbf29726a3"), coin_balance: 5.3, choices: [ {"symbol": "ADA", "allocation": 1.0}, {"symbol": "XLM", "allocation": 1.0}, {"symbol": "NEO", "allocation": 2.0}, {"symbol": "EOS", "allocation": 0.0}, {"symbol": "MIOTA", "allocation": 6.0} ] } ])

db.capcoin_history.insertMany([
	{ _id: new ObjectId("5a8608233d378876bf62d822"), gameId: new ObjectId("5a8608233d378876bf62d818"), userId: new ObjectId("5a8607d4971c50fbf29726a2"), date: new Date(1519048800000), balance: 12 },
	{ _id: new ObjectId("5a8608233d378876bf62d823"), gameId: new ObjectId("5a8608233d378876bf62d818"), userId: new ObjectId("5a8607d4971c50fbf29726a2"), date: new Date(1519049700000), balance: 13 },
	{ _id: new ObjectId("5a8608233d378876bf62d824"), gameId: null, userId: new ObjectId("5a8607d4971c50fbf29726a2"), date: new Date(1519050600000), balance: 14 },
	{ _id: new ObjectId("5a8608233d378876bf62d825"), gameId: null, userId: new ObjectId("5a8607d4971c50fbf29726a2"), date: new Date(1519051500000), balance: 15 }])

/* Commands for testing game_controller functions:

getLatestGame: curl -X GET http://localhost:9000/api/game/
createAndUpdateEntry (create): curl -X POST http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/ -d '{ "choices": [["BTC", 2], ["ETH", 3], ["XRP", 2], ["BCH", 2], ["LTC", 1]] }' -H "Content-Type: application/json"
createAndUpdateEntry (update): curl -X PUT http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/ -d '{ "choices": [["BTC", 5], ["ETH", 0], ["XRP", 2], ["BCH", 2], ["LTC", 1]] }' -H "Content-Type: application/json"
getEntry: curl -X GET http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/
deleteEntry: curl -X DELETE http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/

*/
