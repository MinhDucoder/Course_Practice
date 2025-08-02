import mongoose, { plugin, Schema } from "mongoose"
import MongooseDelete from "mongoose-delete"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

const UserSchema = new Schema({
        name:{
            type: String,
            require: [true, 'name is require'],
            trim: true,
            maxLength: [100, 'Name cannot exeed 100 characters']
        },
        email:{
            type: String,
            require: [true, 'Email is require'],
            trim: true,
            match: [/.+@.+\..+/, "Please fill a valid email address"],
        },
        password:{
            type: String,
            require: true,
            minLength: 8
        },
        roles:{
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)



//hash password turoc khi save
// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next()
//     try {
//         //gen salt do dai 10
//         const salt = await bcrypt.genSalt(10)
//         //hash password ket hop voi salt truoc khi save
//         this.password = await bcrypt.hash(this.password, salt)
//         next()
//     } catch (error) {
//         next(err)
//     }
// })

//delete plugin
UserSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('User', UserSchema)