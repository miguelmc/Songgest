// Triple schema.

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TripleSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  song: {
    type: Schema.ObjectId,
    ref: 'Song'
  },
  count: {
    type: Number,
    default: 1
  }
});

mongoose.model('Triple', TripleSchema);
