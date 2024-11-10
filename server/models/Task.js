import { pool } from "../helpers/db.js";

const selectAllTasks = async () => {
  return await pool.query("select * from task");
};

const InsertTask = async (description) => {
  return await pool.query(
    "insert into task (description) values ($1) returning *",
    [description],
  );
};

const deleteTask = async (id) => {
  return await pool.query("delete from task where id = $1", [id]);
};

export { selectAllTasks, InsertTask, deleteTask };
