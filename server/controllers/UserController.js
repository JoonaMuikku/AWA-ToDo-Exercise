import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import {
  insertUser,
  selectUserByEmail,
  createUserObjet,
} from "../models/User.js";
import { ApiError } from "../helpers/ApiError.js";

const postRegistartion = async (req, res, next) => {
  try {
    if (!req.body.email || req.body.email.length === 0)
      return next(new ApiError(400, "invalid email for user"));
    if (!req.body.password || req.body.password.length < 8)
      return next(
        new ApiError(400, "Password must be at least 8 characters long"),
      );

    const userFromDb = await insertUser(
      req.body.email,
      hash(req.body.password, 10),
    );
    const user = userFromDb.rows[0];
    return res.status(201).json(createUserObjet(user.id, user.email));
  } catch (error) {
    return next(error);
  }
};

const createUserObjet = (id,email,token=undefined) => {
  return {
    'id': id,
    'email': email,
    ...(token !== undefined && { 'token': token }),
  };
};

const postLogin = async (req, res, next) => {
  const invalid_cedential_message = "Invalid Credentials";
  try {
    const userFromDb = await selectUserByEmail(req.body.email);
    if (userFromDb.rows.length === 0)
      return next(new ApiError(invalid_cedential_message));

    const user = userFromDb.rows[0];
    if (!(await compare(req.body.password, user.password)))
      return next(new ApiError(invalid_cedential_message, 401));

    const token = sign(req.body.email, process.env.JWT_SECRET_KEY);
    return res.status(200).json(createUserObjet(user.id, user.email, token));
  } catch (error) {
    return next(error);
  }
};

export { postRegistartion, createUserObjet, postLogin };
