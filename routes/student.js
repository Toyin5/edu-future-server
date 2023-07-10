import express from "express";
import { login, registerStudent, verify } from "../controllers/student.js";

const studentRoute = express.Router();

studentRoute.post("/auth/register", registerStudent);
studentRoute.post("/auth/login", login);
studentRoute.patch("/auth/verify/:studentId?", verify);

export default studentRoute;
