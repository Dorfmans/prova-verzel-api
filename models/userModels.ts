import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

export const userModels = (mongoose.models.user || mongoose.model('user', userSchema));