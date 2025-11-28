import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password must be at least 6 characters"],
      selected: false,
    },

    skills: {
      type: [String],
      default: [],
      set: (skills) => skills.map((s) => s.trim().toLowerCase()),
    },

    pushSubscriptions: {
      type: [
        {
          endpoint: String,
          keys: {
            p256dh: String,
            auth: String,
          },
        },
      ],

      default: [],
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },

    emailUnsubscribed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// middleware to hash the password and remove the confirm password field so that it would not save in the database
userSchema.pre("save", async function () {
  // Run if the password was actually modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  //override the plain text password with hash
  this.password = hash;
});

//method to compare the user password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
