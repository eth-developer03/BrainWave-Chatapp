import mongoose from 'mongoose';
import crypto from 'crypto'; // Used Crypto For Hashing Instead of Bcrypt keeping Data Security in Mind


// User's Schema

export interface IUser extends mongoose.Document {
  Name: string;
  Email: string;
  Password: string;
  Age?: number;
  Role: string;
  hash?: string;
  salt?: string;
  setPassword(password: string): Promise<void>;
  validPassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Age: Number,
    Role: {
      type: String,
      required: true,
    },
    hash: String,
    salt: String,
  },
  {
    timestamps: true,
  }
);

// To Verify The Password

UserSchema.methods.validPassword = function (password: string) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return this.Password === hash;
};

// For Hashed Password Setup
UserSchema.methods.setPassword = async function (password: string) {
  // Creating a unique salt for a particular user
  this.salt = await crypto.randomBytes(16).toString('hex');

  this.Password = await crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

export const User = mongoose.model<IUser>('User', UserSchema);

// Chat Schema

export interface IChatMessage {
  // sender:mongoose.Types.ObjectId;
  sender: IUser['_id'];

  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  currentUser: String;
  participants: mongoose.Types.ObjectId[];
  messages: IChatMessage[];
}

const ChatSchema = new mongoose.Schema<IChat>({
  currentUser: { type: String, required: true },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }, // For Populating The Data
      content: { type: String, default: 'hi' },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
