const mongoose = require("mongoose");
const Counter = require("./Counter.model");

const User = mongoose.Schema(
  {
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png",
    },
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    otptype: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    friendCode: { type: String, unique: true },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    sentRequests: [
      {
        to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    allowSearchByCode: {
      type: Boolean,
      default: true
    },
    allowFriendRequests: {
      type: Boolean,
      default: true
    },
    showActiveStatus: { type: Boolean, default: true },
    defaultPostVisibility: {
      type: String,
      enum: ["friends", "private", "custom"],
      default: "friends",
    },
    defaultDenyList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    twoFactorEnabled: { type: Boolean, default: false },

    isdelete: {
      type: Boolean,
      default: false,
    },
  },


  { timestamps: true }
);

// Tự động tạo friendCode trước khi lưu người dùng mới
User.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "friendCode" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const seqString = counter.seq.toString().padStart(6, "0");
      this.friendCode = `#${seqString}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
