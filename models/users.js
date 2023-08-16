const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(name, password) {
  return this.findOne({ name })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error({ message: 'something wrong with user name' }));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error({ message: 'name or password is incorrect' }));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
