import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
	start_date: { type: Date },
	finish_date: { type: Date },
	currency_list: [{ type : String, uppercase: true }],
});

const PerformanceSchema = new Schema({
	game_id: { type: Schema.Types.ObjectId, ref: 'Game' },
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	percent_return: { type: Number },
	last_updated: { type: Date }
});

const UserChoices = new Schema({
    game_id: { type: Schema.Types.ObjectId, ref: 'Game' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    choices: [[{ type: String, uppercase: true }, { type: Number, min: 0, max: 10 }]],
});

const GameModel = mongoose.model('Game', GameSchema);
const PerformanceModel = mongoose.model('Performance', PerformanceSchema);
const UserChoicesModel = mongoose.model('UserChoices', UserChoicesSchema);

export default GameModel;
export default PerformanceModel;
export default UserChoicesModel;