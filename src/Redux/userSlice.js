import { createSlice } from '@reduxjs/toolkit';
import { users as initialUsers } from '../User';
import { v4 as uuidv4 } from "uuid";


const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
const storedUser = JSON.parse(localStorage.getItem('user')) || null;

const combinedUsers = [...initialUsers, ...storedUsers];

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: combinedUsers, 
    user: storedUser,     
  },
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const existingUser = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (existingUser) {
        state.user = existingUser;
        localStorage.setItem('user', JSON.stringify(existingUser));
      } else {
        console.error('Invalid email or password');
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },

    addUser: (state, action) => {
      const newUser = { ...action.payload, id: uuidv4() };
      // state.users.push(newUser); 
      // localStorage.setItem('users', JSON.stringify(state.users)); 
      state.users = [...state.users, newUser];
      localStorage.setItem('users', JSON.stringify(state.users));

    },

    removeUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== 1) {
        state.users[index] = action.payload;
      }
    }

  },
});

export const { login, logout, addUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;

