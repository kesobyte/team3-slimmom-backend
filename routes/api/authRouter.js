import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// prettier-ignore
import { register, login, logout, getCurrentUsers, verifyEmail, resendVerifyEmail} from "../../controllers/authController.js"
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

/* POST: http://localhost:5000/api/auth/register
{
  "name": "Juan Dela Cruz"
  "email": "juan@email.com",
  "password": "password"
}
*/
router.post("/register", ctrlWrapper(register));

/* POST: http://localhost:5000/api/auth/login
{
  "email": "juan@email.com",
  "password": "password"
}
*/
router.post("/login", ctrlWrapper(login));

/* GET: http://localhost:5000/api/auth/current */
router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

/* GET: http://localhost:5000/api/auth/logout */
router.get("/logout", authenticateToken, ctrlWrapper(logout));

/* GET: http://localhost:5000/api/auth/verify/:verificationToken */
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

/* POST: http://localhost:5000/api/auth/verify 
{
  "email": "juan@email.com",
}
*/
router.post("/verify", ctrlWrapper(resendVerifyEmail));

export { router };
