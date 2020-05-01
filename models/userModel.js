const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name!'],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (ele) {
        //this work only on save
        return ele === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//middileware Doc pre
userSchema.pre('save', async function (next) {
  //run if password was actually modified
  if (!this.isModified('password')) return next();

  //hash password with 12 cost salt
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//Create New password
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Query middleware
userSchema.pre(/^find/, function (next) {
  //this point to the curr querry
  this.find({ active: { $ne: false } });
  next();
});

//Checking correct password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//changed password after login
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //if the user changed password
  if (this.passwordChangedAt) {
    changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  //if the user doesn't change password
  return false;
};

//Reset password process
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//Model
const User = mongoose.model('User', userSchema);

module.exports = User;
