const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();
    res.status(200).json({ success: true, message: "User Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error Occured" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        message: "Login Successfully",
        user: {
          id: checkUser._id,
          email: checkUser.email,
          role: checkUser.role,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error Occured" });
  }
};

const logoutUser = (req, res) => {
  res
    .clearCookie("token")
    .json({ success: true, message: "Logout Successfully" });
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized User!",
    });
  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized User!" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
