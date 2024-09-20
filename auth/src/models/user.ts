import mongoose, { Document, Model, Schema } from "mongoose";
import { Password } from "../services/password";

// 1. Define the document interface
interface IUser extends Document {
  email: string;
  password: string;
}

// 2. Define the input interface for creating a user
interface IUserInput {
  email: string;
  password: string;
}

// 3. Define the interface for the User model, including statics
interface IUserModel extends Model<IUser> {
  build(attrs: IUserInput): IUser;
}

// 4. Create the User schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // transforms returned JSON
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        ret.id = doc._id;
      },
    },
  }
);

// middleware hooks
// arrow function can't be used due to 'this'
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    // isModified true both for create and update
    const hashed = await Password.toHash(this.get("password"));

    this.set("password", hashed);
  }
  done();
});
userSchema.pre("findOne", async function (done) {});

// 5. Add the 'build' static method to the schema
userSchema.statics.build = (attrs: IUserInput) => {
  return new User(attrs);
};

// 6. Create the User model, passing both IUser and IUserModel
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

// 7. Export the model and interfaces
export { User };

// no TS support if we directly use User constructor
// const bad_user = new User({emakil: '',password:'',abc:''})

// to involve TS checking to create a user
// const buidUser = (user: UserAttrs) => {
//   return new User(user);
// };
// const good_user = buidUser({email: '',password:'',})

// const best_user = User.build({
//   email: "test@test.com",
//   password: "",
// });
// console.log(best_user.email, best_user.password)
