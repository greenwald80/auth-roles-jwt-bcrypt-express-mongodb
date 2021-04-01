const User = require("./models/User.js");
const Role = require("./models/Role.js");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = { id: id, roles: roles };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  //http://localhost:3000/auth/registration => POST => Body => raw => json => {"username":"user", "password":"pass"}
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with ${username} already exists` });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "User created successfully" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }
  //http://localhost:3000/auth/login => POST => Body => raw => json => {"username":"user", "password":"pass"}
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ message: `User ${username} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        res.status(400).json({ message: `Password is not correct` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token: token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }
  async getUsers(req, res) {
    try {
      //костыль, в реальных проектах так не делать, сделал чтобы сохранить первые роли в бд
      //   const userRole = new Role();
      //   const adminRole = new Role({ value: "ADMIN" });
      //   await userRole.save();
      //   await adminRole.save();

      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
