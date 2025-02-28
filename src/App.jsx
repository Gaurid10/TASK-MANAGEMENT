import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Taskform from "./Components/Taskform";
import TaskList from "./Components/TaskList";
import AddUser from "./Components/AddUser";
import UserList from "./Components/UserList";

const App = () => (
  <Provider store={store}>
    <Navbar />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/task" element={<Taskform />} />
      <Route path="/task-list" element={<TaskList />} />
      <Route path="/tasks/edit/:taskId" element={<Taskform />} />
      <Route path="/users/add-user" element={<AddUser />} />
      <Route path="/users/user-list" element={<UserList />} />
      <Route path="/user/edit/:userId" element={<AddUser />} />
    </Routes>
  </Provider>
);

export default App;
