import { Router } from 'express';
import {
    deleteAnyVideo,
    getAllUsers,
    getSystemStats,
} from "../controllers/admin.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifyAdmin } from "../middlewares/admin.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.use(verifyAdmin); // Apply verifyAdmin middleware to all routes in this file

router.route("/stats").get(getSystemStats);
router.route("/users").get(getAllUsers);
router.route("/video/:videoId").delete(deleteAnyVideo);

export default router;
