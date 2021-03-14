/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-04
 * Description: File holding a user model.
 */

import mongoose, { Schema, Document, Model, HookNextFunction } from "mongoose";

import { PasswordEncoder } from "../services";
import { UserRole } from "../types";
import { tokenConfig } from "../config";

/**
 * Interface that describes the properties required
 * when creating a new user.
 * This interface allows intellisense and error checking
 * when a user model is created.
 */
export interface UserProps {
  email: string;
  password: string;
  /** Part of key used to generate refresh token, unique for each client */
  clientSecret: string;
  role: UserRole;

  profile: Partial<{
    name: Partial<{
      first: string;
      last: string;
    }>;
    avatar: string;
  }>;
}

/**
 * Interface that describes the properties in a user
 * document. Required by mongoose.
 */
export type UserDocument = Document<UserProps> & {
  email: string;
  password: string;
  /** Part of key used to generate refresh token, unique for each client */
  clientSecret: string;
  role: UserRole;

  profile: {
    name: {
      first: string;
      last: string;
    };
    avatar: string;
  };

  // These fields are automatically appended by mongodb.
  createdAt: Date;
  updatedAt: Date;
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
    clientSecret: {
      type: String,
      required: true,
      min: 10,
    },
    role: {
      type: String,
      enum: Object.keys(UserRole),
      required: true,
    },

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
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.clientSecret;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      versionKey: false,
    },
  }
);

/**
 * Interface that describes attributes associating
 * with the User model.
 */
export interface UserModel extends Model<UserDocument> {
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

userSchema.pre<UserDocument>("save", async function (done: HookNextFunction) {
  if (this.isModified("password")) {
    const hashed = await PasswordEncoder.toHash(this.password);
    this.set("password", hashed);
    // Generate new client secret to revoke previous tokens
    const secret = PasswordEncoder.randomString(tokenConfig.clientSecretLength);
    this.set("clientSecret", secret);
  }
  done();
});

export const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
