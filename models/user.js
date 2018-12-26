var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
//auth user input against database using
//mongoose statics lets you add methods to the model
UserSchema.statics.authenticate = (email,password,callback) =>{
  User.findOne({email: email})
    .exec((error,user)=>{
      if(error){
        return callback(error)
      } else if(!user){
        let err = new Error('User not found')
        err.status = 401
        return callback(err)
      }
      bcrypt.compare(password,user.password, (err,result) => {
        if(result)
          return callback(null,user)
        else
          return callback()
      })

    })
}
//verify if email is unique and handle error properly
UserSchema.statics.everify = (email,callback) =>{
  User.findOne({email: email})
    .exec((error,exist)=>{
      if(exist){
        return callback(exist)
      } else
        return callback(error)
    })
}

//mongoose pre-save put, runs before saving
UserSchema.pre('save', function (next){
    var user = this;
    bcrypt.hash(user.password, 10, function (err,hash){
        if(err)
            return next(err)
        user.password = hash
        next()
    })
})

var User = mongoose.model('User', UserSchema);
module.exports = User;