import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Verify from "../models/Verify.js";
import sendEmail from "../utils/sendEmail.js";
import sendHtml from "../utils/sendHtml.js";
import Jwt from "jsonwebtoken";

export const registerStudent = async (req, res) => {
  const { email, password, fullName, phone } = req.body;
  const userExists = await Student.findOne({ email });
  if (userExists) {
    return res.status(409).json({
      error: "Duplicate Account",
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const code = crypto.randomBytes(64).toString("hex");
    const student = new Student({
      email,
      phone,
      password: await bcrypt.hash(password, salt),
      fullName
    });
    const verify = new Verify({
      studentId: student._id,
      token: code,
    });

    await student.save();
    await verify.save();

    const url = new URL(process.env.VERIFY_URL + student._id);
    url.searchParams.set("token", code);
    console.log(url);
    await sendEmail(email, "Verify your account", sendHtml(url, first_name));
    res.status(201).json({
      status: 201,
      data: {
        email,
        fullName
      },
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Verification code sent!",
      });
    }
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await Student.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ error: "User not found", token: null });
  }
  try {
    const match = await bcrypt.compare(password, userExist.password);
    const user = { id: userExist._id };
    const token = Jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: 360000 });

    if (match) {
      return userExist.verified
        ? res.status(200).json({
            status: 200,
            message: "Successfully logged in",
            token: token,
          })
        : res.status(403).json({ error: "Account not verified", token: null });
    }
    return res.status(401).json({ error: "Incorrect Password", token: null });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Error decrypting",
      token: null,
    });
  }
};

export const verify = async (req, res) => {
  const { studentId } = req.params;
  const { token } = req.query;

  try {
    const verification = await Verify.findOne({ studentId });

    if (!verification) {
      return res.status(400).json({
        error: "Link expired!",
      });
    }

    if (verification.token === token) {
      await Student.findByIdAndUpdate(studentId, { verified: true });
      await Verify.findByIdAndDelete(studentId);

      return res.status(200).json({
        message: "User Verified",
      });
    }

    return res.status(400).json({ errors: "Invalid Link" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: "Server error",
    });
  }
};
