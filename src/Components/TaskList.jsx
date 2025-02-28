import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../Redux/taskSlice";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Button,
  Collapse,
  Checkbox,
} from "@mui/material";
import { Delete, Edit, Add, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const tasks = useSelector((state) => state.tasks.tasks);
  const users = useSelector((state) => state.user.users);
  const user = useSelector((state) => state.user.user); 
  const userRole = user?.role || "User";

  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleDelete = (taskId) => dispatch(deleteTask(taskId));

  const handleEdit = (taskId) => navigate(`/tasks/edit/${taskId}`);

  const toggleTaskStatus = (task, newStatus) => {
    dispatch(
      updateTask({
        ...task,
        status: newStatus,
        assignedTo: task.assignedTo, 
      })
    );
  };

  const toggleExpand = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getAssignedUser = (assignedToId) => {
    const assignedUser = users.find((user) => user.id === assignedToId);
    return assignedUser ? assignedUser.name : "Unknown User";
  };

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach((taskId) => dispatch(deleteTask(taskId)));
    setSelectedTasks([]); 
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
  };

  const visibleTasks =
    userRole === "student"
      ? tasks.filter((task) => task.assignedTo === user?.id)
      : tasks;

  return (
    <Container>
      <Typography variant="h5" sx={{ mt: 4 }}>
        Task List
      </Typography>


      {userRole === "admin" && (
  <>
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      sx={{ mb: 2 }}
      onClick={() => navigate("/task")}
    >
      Add Task
    </Button>

    <Button
      variant="contained"
      color="black"
      startIcon={<DeleteForeverIcon />}
      onClick={handleBulkDelete}
      sx={{ mb: 2, ml: 2, borderColor: "black" }}
    >
      Delete Selected Tasks
    </Button>

    <Button
      variant="outlined"
      color="primary"
      onClick={handleSelectAll}
      sx={{ mb: 2, borderColor: "black", padding: 0.5, ml: 1 }}
    >
      {selectedTasks.length === tasks.length ? "Unselect All" : "Select All"}
    </Button>
  </>
)}

      {!visibleTasks.length ? (
        <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
          No tasks available.
        </Typography>
      ) : (
        <List>
          {visibleTasks.map((task) => (
            <React.Fragment key={task.id}>
              <ListItem button onClick={() => toggleExpand(task.id)}>
                {userRole === "admin" && (
                  <Checkbox
                    edge="start"
                    checked={selectedTasks.includes(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(task.id)}
                    sx={{ mr: 2 }}
                  />
                )}

                <IconButton edge="start">
                  {expandedTaskId === task.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>

                <ListItemText
                  primary={task.title || "Untitled Task"}
                  secondary={`Status: ${task.status} | Created At: ${formatDate(
                    task.createdAt
                  )} | Assigned To: ${getAssignedUser(task.assignedTo)}`}
                  sx={{
                    textDecoration:
                      task.status === "Completed" ? "line-through" : "none",
                  }}
                />

                <Chip
                  label={task.status}
                  color={
                    task.status === "Completed"
                      ? "success"
                      : task.status === "Pending"
                      ? "error"
                      : "primary"
                  }
                  sx={{ width: "100px", cursor: "pointer", mr: 5 }}
                  onClick={() => toggleExpand(task.id)}
                />

                {userRole === "admin" && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEdit(task.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>

              <Collapse in={expandedTaskId === task.id} timeout="auto" unmountOnExit>
                <Typography
                  variant="body2"
                  sx={{ ml: 8, mb: 2, color: "text.secondary" }}
                >
                  <strong>Description:</strong>{" "}
                  {task.description || "No description provided."}
                </Typography>
                <div>
                  <Typography variant="body2" sx={{ ml: 8, mb: 2, color: "text.secondary" }}>
                    <strong>Change Status:</strong>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1, ml: 1, borderRadius: 8 }}
                      onClick={() => toggleTaskStatus(task, "In Progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mr: 1, borderRadius: 4 }}
                      onClick={() => toggleTaskStatus(task, "Completed")}
                    >
                      Completed
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mr: 1, borderRadius: 4 }}
                      onClick={() => toggleTaskStatus(task, "Pending")}
                    >
                      Pending
                    </Button>
                  </Typography>
                </div>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default TaskList;

