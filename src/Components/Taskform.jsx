import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../Redux/taskSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import Textarea from "@mui/joy/Textarea";
import { useNavigate, useParams } from 'react-router-dom';

const Taskform = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const tasks = useSelector((state) => state.tasks.tasks);
  const users = useSelector((state) => state.user.users);

  const [students, setStudents] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    assignedTo: '',
    createdAt: new Date().toLocaleString(),
  });

  useEffect(() => {
    const uniqueStudents = users
      .filter(user => user.role === 'student')
      .filter((value, index, self) => self.findIndex(s => s.id === value.id) === index);
    setStudents(uniqueStudents);

    if (taskId) {
      const task = tasks.find((task) => task.id === parseInt(taskId));
      if (task) {
        setTaskToEdit(task);
        setFormValues({
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          createdAt: task.createdAt,
        });
      }
    }
  }, [taskId, tasks, users]);

  const formik = useFormik({
    enableReinitialize: true, 
    initialValues: formValues,
    validationSchema: Yup.object({
      title: Yup.string().min(3, 'Title must be at least 3 characters').required('Required'),
      description: Yup.string().min(10, 'Description must be at least 10 characters').required('Required'),
      assignedTo: Yup.string().required('Please assign the task to a student'),
    }),
    onSubmit: (values, { resetForm }) => {
      if (taskToEdit) {
        dispatch(updateTask({ ...taskToEdit, ...values }));
      } else {
        dispatch(addTask({ ...values, id: Date.now(), status: 'Pending' }));
      }
      resetForm();
      navigate('/task-list');
    },
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    formik.setFieldValue(name, value);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {taskToEdit ? 'Edit Task' : 'Add New Task'}
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          margin="normal"
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <Textarea
          placeholder="Description"
          minRows={4}
          name="description"
          sx={{ width: '100%', mt: 2 }}
          value={formValues.description}
          onChange={handleChange}
        />
        {formik.touched.description && formik.errors.description && (
          <Typography color="error" variant="body2">{formik.errors.description}</Typography>
        )}

        <FormControl fullWidth margin="normal" error={formik.touched.assignedTo && Boolean(formik.errors.assignedTo)}>
          <InputLabel>Assigned To</InputLabel>
          <Select
            name="assignedTo"
            value={formValues.assignedTo}
            onChange={handleChange}
          >
            {students.map(student => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.assignedTo && formik.errors.assignedTo && (
            <Typography color="error" variant="body2">{formik.errors.assignedTo}</Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Date & Time"
          value={formValues.createdAt}
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          {taskToEdit ? 'Update Task' : 'Add Task'}
        </Button>
      </form>
    </Container>
  );
};

export default Taskform;






