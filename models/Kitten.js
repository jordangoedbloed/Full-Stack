import mongoose from "mongoose";

const Schema = mongoose.Schema;

const KittenSchema = new Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  color: { type: String, required: true },
}, { toJSON: { virtuals: true }, collection: 'kitty' })

export default mongoose.model("Kitty", KittenSchema);