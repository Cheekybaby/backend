import express from "express";
import { create, readOne, readAll, update, deleteOne, startTaskTimer, endTaskTimer} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/', protectRoute, create);
router.get('/', protectRoute, readAll);
router.get('/:id', protectRoute, readOne);
router.put('/:id', protectRoute, update);
router.delete('/:id', protectRoute, deleteOne);
router.patch('/:id/start', protectRoute, startTaskTimer);
router.patch('/:id/end', protectRoute, endTaskTimer);

export default router;