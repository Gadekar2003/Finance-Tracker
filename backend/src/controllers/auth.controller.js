const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      console.log(user);
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        res.send({ message: "Login Success", data: user, status: true });
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  register: async (req, res) => {
    try {
      //console.log(req.body)
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .send({ message: "All fields are required", status: false });
      }

      const hashedPassword = bcrypt.hashSync(password, 4);

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      res.send({ message: "User created", status: true, data: user });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error", status: false });
    }
  },
};

module.exports = { authController };
