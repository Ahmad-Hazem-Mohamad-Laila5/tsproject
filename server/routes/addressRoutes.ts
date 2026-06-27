import express from "express";
import auth from "../middleware/auth.js";
import {
  addAdress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.get("/", auth, getAddresses);
addressRouter.post("/", auth, addAdress);
addressRouter.put("/:id", auth, updateAddress);
addressRouter.delete("/:id", auth, deleteAddress);

export default addressRouter;
