// Script for clearing out the local coinduel database and inserting test data
// To run this script, execute the command: 'mongo < test_data.js'

use coinduel
db.getCollectionNames().forEach(
  function(collection_name) {
    db[collection_name].remove({})
  }
);

db.users.insertMany([
	{ _id: new ObjectId("5a8607d4971c50fbf29726a2"), email: '1@gmail.com', username: 'p1', password: '1', coinBalance: 0 },
	{ _id: new ObjectId("5a8607d5971c50fbf29726a3"), email: '2@gmail.com', username: 'p2', password: '2', coinBalance: 10 },
	{ _id: new ObjectId("5a8607d6971c50fbf29726a4"), email: '3@gmail.com', username: 'p3', password: '3', coinBalance: 30 },
	{ _id: new ObjectId("5a8607d6971c50fbf29726a5"), email: '4@gmail.com', username: 'p4', password: '4', coinBalance: 40 }])

db.games.insertMany([
	{ _id: new ObjectId("5a8608233d378876bf62d817"), start_date: new Date(1519048800000), finish_date: new Date(1519423200000), currency_list: ["BTC", "ETH", "XRP", "BCH", "LTC"]},
	{ _id: new ObjectId("5a8608233d378876bf62d818"), start_date: new Date(1519653600000), finish_date: new Date(1520028000000), currency_list: ["ADA", "XLM", "NEO", "EOS", "MIOTA"]},
	{ _id: new ObjectId("5a8608233d378876bf62d819"), start_date: new Date(1520258400000), finish_date: new Date(1520632800000), currency_list: ["DASH", "XMR", "ZCL", "XVG", "BNB"]}])


db.entries.insertMany([
  { _id: new ObjectId("5a8ace5a53bb81002573c1f0"), userId:"5a8607d4971c50fbf29726a2", percent_return: 0, choices: { "DASH": 1.0, "XMR": 1.0, "ZCL": 2.0, "XVG": 0.0, "BNB": 6.0}},
  { _id: new ObjectId("5a8ace5a53bb12302573c1f0"), userId:"5a8607d5971c50fbf29726a3", percent_return: 0, choices: { "ADA": 1.0, "XLM": 1.0, "NEO": 2.0, "EOS": 0.0, "MIOTA": 6.0}} ])
/* Commands for testing game_controller functions:

getLatestGame: curl -X GET http://localhost:9000/api/game/
createAndUpdateEntry (create): curl -X POST http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/ -d '{ "choices": [["BTC", 2], ["ETH", 3], ["XRP", 2], ["BCH", 2], ["LTC", 1]] }' -H "Content-Type: application/json"
createAndUpdateEntry (update): curl -X PUT http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/ -d '{ "choices": [["BTC", 5], ["ETH", 0], ["XRP", 2], ["BCH", 2], ["LTC", 1]] }' -H "Content-Type: application/json"
getEntry: curl -X GET http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/
deleteEntry: curl -X DELETE http://localhost:9000/api/game/5a8607d4971c50fbf29726a2/5a8608233d378876bf62d817/

*/
