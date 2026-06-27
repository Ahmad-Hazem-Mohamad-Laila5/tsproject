import express from "express";
import {
    cancelDelivery,
    completeDelivery,
  getDeliveryDetail,
  getMyDeliveries,
  loginPartner,
  updateDeliveryStatus,
  updateLocation,
} from "../controllers/deliveryPartnerController.js";
import deliveruAuth from "../middleware/deliveryAuth.js";

const deliveryPartnerRouter = express.Router();

deliveryPartnerRouter.post("/login", loginPartner);
deliveryPartnerRouter.get("/my-deliveries",deliveruAuth, getMyDeliveries);
deliveryPartnerRouter.get("/my-deliveries/:id",deliveruAuth, getDeliveryDetail);
deliveryPartnerRouter.put("/my-deliveries/:id/complete",deliveruAuth, completeDelivery);
deliveryPartnerRouter.put("/my-deliveries/:id/cancel",deliveruAuth, cancelDelivery);
deliveryPartnerRouter.put("/my-deliveries/:id/status",deliveruAuth, updateDeliveryStatus);
deliveryPartnerRouter.put("/my-deliveries/:id/location",deliveruAuth, updateLocation);

export default deliveryPartnerRouter;
