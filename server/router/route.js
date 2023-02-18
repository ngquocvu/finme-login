import { Router } from "express";
const router = Router();
import * as controller from "../controller/appController.js";
//POST
router.route("/register").post(controller.register);
// router.route("/registerMail").post();
router.route("authenticate").post((req, res) => res.send());
router.route("/login").post(controller.login);

/** GET */
router.route("/user/:username").get(controller.getUser);
router.route("/generateOTP").get(controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

router.route("/updateUser").put(controller.updateUser);

router.route("/resetPassword").put(controller.resetPassword);

export default router;
