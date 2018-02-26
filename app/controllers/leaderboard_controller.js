import User from '../models/user.js';
import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';

// returns sorted leaderboard list for specified game
// // @param req, ex. { }
export const getRankings = (req, res) => {
	GameEntry.find({ gameId: req.params.gameId }, { _id: 0, coin_balance: 1, userId: 1 })
	.sort('-coin_balance')
	.populate('userId', 'username')
	.then((result) => {
		res.json(result);
	})
	.catch((error) => {
		res.status(500).json({ error });
	});
}