import { pool } from "../helpers/db.js";

const insertUser = async (email, hashedpassword) => {
  return await pool.query(
    "insert into account (email, password) values ($1, $2)",
    [email, hashedpassword],
  );
};

const selectUserByEmail = async (email) => {
  return await pool.query("select * from account where email = $1", [email]);
};

export { insertUser, selectUserByEmail };
