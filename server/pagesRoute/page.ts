import { Router } from "express";
import path from "path";

const router = Router();
router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/login.html"), (err) => {
    console.log(err);
  })
);
router.get("/signup", (req, res) => {
  const email = req.query?.email;
  if (email !== undefined && email !== "") {
    res.sendFile(path.resolve(__dirname, "../pages/signup.html"), (err) => {
      err && console.log(err);
    });
  } else {
    res.redirect("/verify-email");
  }
});
router.get("/verify-email", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/verify-email.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/otp", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/OTP.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/admin-signup", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/admin_signup.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/forgot-password", (req, res) =>
  res.sendFile(
    path.resolve(__dirname, "../pages/forgotPassword.html"),
    (err) => {
      err && console.log(err);
    }
  )
);
router.get("/schedule", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/schedule.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/driller", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/driller.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/paymof", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/paymoff.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/web", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/web.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/compiler", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/compiler.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/pricing", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/pricing.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/ask", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/ask.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/representative", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../pages/repForm.html"), (err) => {
    err && console.log(err);
  })
);
router.get("/reset", (req, res) =>
  res.sendFile(
    path.resolve(__dirname, "../pages/resetPassword.html"),
    (err) => {
      err && console.log(err);
    }
  )
);
export default router;
