/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-04
 * Description: File holding a user model.
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface that describes the properties in a user
 * document.
 */
export type UserDocument = Document & {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpire: Date;

  profile: {
    name: {
      first: string;
      last: string;
    };
    avatar: string;
  };

  dateJoined: Date;
};

/**
 * Schema used to model users.
 */
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      max: 80,
      min: 6,
    },
    password: {
      type: String,
      max: 1024,
      min: 6,
    },
    passwordResetToken: String,
    passwordResetExpire: Date,

    profile: {
      name: {
        first: {
          type: String,
          min: 2,
          max: 50,
          required: true,
        },
        last: {
          type: String,
          min: 2,
          max: 50,
          required: true,
        },
      },
      avatar: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
