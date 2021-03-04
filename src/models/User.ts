/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-04
 * Description: File holding a user model.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Interface that describes the properties required
 * when creating a new user.
 * This interface allows intellisense and error checking
 * when a user model is created.
 */
export interface UserProps {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpire: Date;

  profile: Partial<{
    name: Partial<{
      first: string;
      last: string;
    }>;
    avatar: string;
  }>;

  dateJoined: Date;
}

/**
 * Interface that describes the properties in a user
 * document. Required by mongoose.
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
 * Schema used to model users. Required by mongoose.
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

/**
 * Interface that describes attributes associating
 * with the User model.
 */
interface UserModel extends Model<UserDocument> {
  build(props: Partial<UserProps>): UserDocument;
}

/**
 * Return a user document with specified attr.
 * Invoke by calling User.build().
 *
 * @param props Properties associating with the user
 * @see UserProps
 * @see UserModel
 */
const build = (props: Partial<UserProps>) => {
  return new User(props);
};
userSchema.static("build", build);

export const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
