var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var HeadlineSchema = new Schema({
  
  title: {
    type: String,
    required: true,
    unique: true
  },

  link: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  saved: {
    type: Boolean,
    default: false
  },

  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]  
});

var Headline = mongoose.model("Headline", HeadlineSchema);


module.exports = Headline;
