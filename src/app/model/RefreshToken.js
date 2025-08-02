import mongoose, { Schema } from "mongoose"

const refreshTokenSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})


export default mongoose.model('refreshToken', refreshTokenSchema)