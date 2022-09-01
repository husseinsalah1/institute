const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      default: 0,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  return userObject;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    process.env.JWT_SECRET
  );
  user.token = token;
  await user.save();

  return token;
};

//hash password
UserSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await bcryptjs.hash(this.password, 8);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
