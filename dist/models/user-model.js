import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { UserType, UserRole } from "../types/user-type.js";
// Define the user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minLength: [2, "First name should be at least 2 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minLength: [2, "Last name should be at least 2 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        // select: false,
    },
    about: {
        type: String,
        default: "",
    },
    image: {
        id: String,
        url: String,
    },
    experienceLevel: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.REGULAR,
    },
    userRole: {
        type: [String],
        default: [],
    },
    userGoal: {
        type: [String],
        default: [],
    },
    userPreference: {
        type: [String],
        default: [],
    },
    userType: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.BEGINEER,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: new Date(),
    },
}, {
    timestamps: true,
    versionKey: false,
    selectPopulatedPaths: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Add pagination plugin
userSchema.plugin(mongoosePaginate);
userSchema.index({ firstName: 1, lastName: 1, email: 1 });
userSchema.index({ isVerified: 1 }, { partialFilterExpression: { isVerified: true } });
userSchema.index({ phone: 1 }, { sparse: true });
// Static method to find user by email
userSchema.statics.findOneByEmail = function (email) {
    return this.findOne({ email }).exec();
};
// Create and export the model with pagination type
const User = model("User", userSchema);
export default User;
//# sourceMappingURL=user-model.js.map