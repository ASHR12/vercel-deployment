const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors/index");

const registerUser = async (req, res) => {
  console.log(req.body);
  const user = await userModel.create(req.body);
  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token: token });
};

module.exports = { registerUser, loginUser };
