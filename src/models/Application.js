import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //Step 1 - Insured Info
    businessName: String,
    businessType: String,
    state: String,
    revenue: Number,
    experience: Number,

    //Step 2 - Coverage
    coverageLimit: Number,
    deductible: Number,
    riskLevel: String,

    //Step 3 - Premium
    basePremium: Number,
    finalPremium: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
