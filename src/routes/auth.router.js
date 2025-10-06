import express from "express";
import { login, signup, logout, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/checkAuth', protectRoute, checkAuth);

export default router;