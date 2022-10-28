import mongoose, { Schema } from "mongoose";

const catalogueSchema = new Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    owner: { type: String, required: true }
});

export const catalogueModels = (mongoose.models.catalogue || mongoose.model('catalogue', catalogueSchema));