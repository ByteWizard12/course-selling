const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    }
}, { timestamps: true });

const adminSchema = new Schema({
    email: { 
        type: String, 
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    }
}, { timestamps: true });

const courseSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    imageUrl: { 
        type: String, 
        required: true,
        trim: true
    },
    creatorId: { 
        type: ObjectId, 
        required: true,
        ref: 'admin'
    }
}, { timestamps: true });

const purchaseSchema = new Schema({
    userId: { 
        type: ObjectId, 
        required: true,
        ref: 'user'
    },
    courseId: { 
        type: ObjectId, 
        required: true,
        ref: 'course'
    }
}, { timestamps: true });

// Add indexes for better query performance
userSchema.index({ email: 1 });
adminSchema.index({ email: 1 });
courseSchema.index({ creatorId: 1 });
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
};