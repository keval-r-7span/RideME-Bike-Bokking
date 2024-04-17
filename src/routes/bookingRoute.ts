import { Router } from 'express';
const router = Router()

import {
 viewBooking,createBooking,updateBooking,deleteBooking,bookingStatus,viewBookingById,getRevenue,totalBooking
} from '../controllers/bookingController';
import {validateRequest} from '../validation/bookingValidation';
// import { isAdmin } from '../middleware/authMiddleware';

router.get("/list",viewBooking);
router.get("/status",bookingStatus);
router.post("/",validateRequest,createBooking);
router.get("/revenue", getRevenue);
router.get("/total",totalBooking)
router.get("/:id",viewBookingById);
router.put("/:id", updateBooking);
router.delete("/:id",deleteBooking);

export default router