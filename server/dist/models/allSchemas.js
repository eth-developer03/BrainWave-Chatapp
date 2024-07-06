"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const UserSchema = new mongoose_1.default.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Age: Number,
    Role: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
}, {
    timestamps: true
});
UserSchema.methods.validPassword = function (password) {
    var hash = crypto_1.default
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return this.Password === hash;
};
UserSchema.methods.setPassword = async function (password) {
    // Creating a unique salt for a particular user
    this.salt = await crypto_1.default.randomBytes(16).toString('hex');
    // Hashing user's salt and password with 1000 iterations,
    // 64 length and sha512 digest
    // this.hash = await crypto
    //   .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    //   .toString(`hex`);
    this.Password = await crypto_1.default
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
};
exports.User = mongoose_1.default.model('User', UserSchema);
const ChatSchema = new mongoose_1.default.Schema({
    currentUser: { type: String, required: true },
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{
            sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, default: "hi" },
            timestamp: { type: Date, default: Date.now },
        }],
});
exports.Chat = mongoose_1.default.model('Chat', ChatSchema);
