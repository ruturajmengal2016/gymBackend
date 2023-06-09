const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const joi = require("joi");
const fs = require("fs");
const schema = joi.object({
  name: joi.string().required().optional(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

router.get("/", async (req, res, next) => {
  try {
    console.log("hello")
    res.end()
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    const user = await prisma.gym_user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    if (!user) {
      res.status(400);
      throw new Error("Sorry! You don't have account.");
    }
    res.send("login successfully...");
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    const user = await prisma.gym_user.findUnique({
      where: {
        email: value.email,
      },
    });
    if (user) {
      res.status(400);
      throw new Error("This email is already registered!");
    }
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    await prisma.gym_user.create({
      data: value,
    });
    res.send("registered successfully...");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
