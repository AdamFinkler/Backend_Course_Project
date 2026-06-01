const express = require("express");
const router = express.Router();

const { createUser, getAllUsers, getUserDetails } = require("./users.service");

// POST /api/add - add a new user
router.post("/add", async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    const status =
      err.id === "USER_ALREADY_EXISTS"
        ? 409
        : err.id === "USER_NOT_FOUND"
          ? 404
          : 400;

    return res.status(status).json({
      id: err.id || "SERVER_ERROR",
      message: err.message,
    });
  }
});

// GET /api/users - get all users
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({
      id: err.id || "SERVER_ERROR",
      message: err.message,
    });
  }
});

// GET /api/users/:id - get specific user details
router.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserDetails(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    const status = err.id === "USER_NOT_FOUND" ? 404 : 400;

    return res.status(status).json({
      id: err.id || "SERVER_ERROR",
      message: err.message,
    });
  }
});

module.exports = router;
