import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { users } from "../User";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, users } = useSelector((state) => state.user);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Min 6 characters").required("Required"),
    }),
    onSubmit: (values) => {
      const foundUser = users.find(
        (u) => u.email === values.email && u.password === values.password
      );

      //       const allUsers = useSelector((state) => state.user.users); // Get users from Redux
      // const foundUser = allUsers.find(
      //   (u) => u.email === values.email && u.password === values.password
      // );

      if (foundUser) {
        dispatch(login(foundUser));
      } else {
        alert("Invalid email or password!");
      }
    },
  });

  useEffect(() => {
    // if (user) {
    //   alert(`Welcome ${user.name}! You are logged in as ${user.role}.`);
    if (user) {
      toast.success(`Welcome ${user.name}! You are logged in as ${user.role}.`, {
        position: "top-right",
        autoClose: 3000, 
      });
   


      const roleRoutes = {
        admin: "/task-list",
        student: "/task-list",
        employee: "/task-list",
      };

      navigate(roleRoutes[user.role] || "/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="xs" sx={{ mt: 5, padding: 2, boxShadow: 3 }}>
      <Typography variant="h5" align="center">
        Log In to Continue
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          {...formik.getFieldProps("email")}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          {...formik.getFieldProps("password")}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default Login;


