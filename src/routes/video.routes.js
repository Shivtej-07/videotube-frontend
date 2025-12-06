import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router
    .route("/")
    .get(getAllVideos)

router
    .route("/:videoId")
    .get(optionalAuth, getVideoById);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/publish", upload.fields([
    {
        name: "video",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },

]), publishAVideo);

router
router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;