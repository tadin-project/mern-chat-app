const { UserModel } = require("../models");

const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await UserModel.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already user!", status: false });

    const emailCheck = await UserModel.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "Email already used!", status: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      email,
      username,
      password: hashedPassword,
    });

    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user)
      return res.json({ msg: "Username is not found!", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.json({ msg: "Password is wrong!", status: false });

    delete user.password;

    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};
