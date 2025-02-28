import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../Redux/userSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {  IconButton, InputAdornment } from "@mui/material";



const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const users = useSelector((state) => state.user.users);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (userId) {
      const user = users.find((user) => user.id === userId);
      if (user) setUserToEdit(user);
    }
  }, [userId, users]);

  console.log("Current Users List:", users);

  const generateUniqueId = (newId = `user_${uuidv4()}`) => 
    users.some(user => user.id === newId) ? generateUniqueId() : newId;

  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userToEdit ? userToEdit.name : '',
      email: userToEdit ? userToEdit.email : '',
      role: userToEdit ? userToEdit.role : 'employee',
      password: userToEdit ? userToEdit.password : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      role: Yup.string().required('Role is required'),
      // password: userToEdit
      //   ? Yup.string() :
      password  : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      if (userToEdit) {
        dispatch(updateUser({ ...userToEdit, ...values }));
      } else {
        const newUser = { ...values, id: generateUniqueId() }; 
        dispatch(addUser(newUser));
      }
      navigate('/users/user-list');
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {userToEdit ? 'Edit User' : 'Add New User'}
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          {formik.touched.role && formik.errors.role && (
            <Typography color="error" variant="body2">
              {formik.errors.role}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            // type="password"
            type={showPassword ? "text" : "password"} // Toggle type

            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {/* {!userToEdit && (
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        )} */}

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          {userToEdit ? 'Update User' : 'Add User'}
        </Button>
      </form>
    </Container>
  );
};

export default AddUser;
