const Router = require("express");
const { check } = require("express-validator");
const router = new Router();
const controller = require("./authController.js");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "Username must be not empty").notEmpty(),
    check(
      "password",
      "Password must be not less than 4 characters and not more than 10 characters"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
//Headers => Authorization = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNjRiZjM2Yjg2YzA5MGVmYzdiNGE1NiIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjE3MjY0NTA1LCJleHAiOjE2MTczNTA5MDV9._JZexBmc7i0YVQ_WBzMYle4TRDyBd3yg45tCU9Vwbgg
//router.get("/users", authMiddleware, controller.getUsers);//простая авторизация для просмотра пользователей
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers); //авторизация по ролям для просмотра

module.exports = router;
