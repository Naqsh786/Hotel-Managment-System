import mongoose from "mongoose";

const homeSettingSchema = new mongoose.Schema({
  heroSlides: [{
    image: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    link: { type: String }
  }],
  visibleCategories: [{
    title: { type: String, required: true },
    desc: { type: String },
    image: { type: String },
    link: { type: String },
    isVisible: { type: Boolean, default: true }
  }]
}, { timestamps: true });

const HomeSetting = mongoose.model("HomeSetting", homeSettingSchema);
export default HomeSetting;
