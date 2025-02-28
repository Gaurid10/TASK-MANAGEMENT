import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Popover,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((part) => part.charAt(0).toUpperCase())
          .join("")
          .slice(0, 2)
      : "";

  const adminButtons = [
    { label: "Tasks", path: "/task-list", startIcon: <AssignmentIcon /> },
    { label: "Users", path: "/users/user-list", startIcon: <GroupIcon /> },
  ];

  const roleButtons = {
    admin: adminButtons,
    student: [{ label: "Task List", path: "/task-list" }],
    employee: [{ label: "Add Task", path: "/add-task" }],
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 2, bgcolor: "primary-main" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: "1px",
            color: "#fff",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AssignmentIcon sx={{ fontSize: 30, mr: 1 }} /> Task Management
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {roleButtons[user.role]?.map(({ label, path, startIcon }, idx) => (
              <Button
                key={idx}
                component={Link}
                to={path}
                variant="contained"
                startIcon={startIcon}
                sx={{
                  bgcolor: "whitesmoke",
                  color: "primary.main",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "lightgray" },
                }}
              >
                {label}
              </Button>
            ))}

            <Avatar
              sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
              onClick={handlePopoverOpen}
            >
              {getInitials(user.name)}
            </Avatar>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Box sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  sx={{ mt: 2 }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Popover>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
