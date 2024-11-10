import { emptyOrRows } from "../helpers/utils.js";
import { selectAllTasks, deleteTask, InsertTask } from "../models/Task.js";

const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks();
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

const postTask = async (req, res, next) => {
  try {
    if (!req.body.description || req.body.description.length === 0) {
      const error = new Error("Invalid description for task");
      error.statusCode = 400;
      return next(error);
    }
    const result = await InsertTask(req.body.description);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    return next(error);
  }
};

const DeleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await deleteTask(id);
    return res.status(200).json({ id: id });
  } catch (error) {
    return next(error);
  }
};

export { getTasks, postTask, DeleteTask };
