import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Typography,
  TextField, 
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../Redux/userSlice"; 
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const users = useSelector((state) => state.user.users);
  const user = useSelector((state) => state.user.user);
  const userRole = user?.role || "User";

 
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueUsers = Array.from(new Map(users.map(user => [user.id, user])).values());

  const filteredUsers = uniqueUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = (userId) => {
    dispatch(removeUser(userId));
  };

  const handleEdit = (userId) => navigate(`/user/edit/${userId}`);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        User List
      </Typography>

      {userRole === "admin" && (
        <>
          <TextField
            fullWidth
            label="Search by Name, Email, or Role"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddAlt1Icon />}
            sx={{ mb: 2 }}
            onClick={() => navigate("/users/add-user")}
          >
            Add Users
          </Button>
        </>
      )}

      
      {filteredUsers.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <List>
          {filteredUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemText
                primary={user.name}
                secondary={`Email: ${user.email} | Role: ${user.role}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(user.id)}>
                  <DriveFileRenameOutlineIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteUser(user.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default UserList;

