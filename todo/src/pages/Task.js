import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Grid,
  Switch,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import apiDefinitions from "../api/apiDefinitions";
import { useCurrentQueryParams } from "../hooks/CustomHooks";
import Swal from "sweetalert2";

const Task = () => {
  const navigate = useNavigate();
  const taskID = useCurrentQueryParams("id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [dueDateError, setDueDateError] = useState(false);

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    let error = false;
    if (title === "") {
      setTitleError("Title is required");
      error = true;
    } else {
      setTitleError("");
    }
    if (description === "") {
      setDescriptionError("Description is required");
      error = true;
    } else {
      setDescriptionError("");
    }
    if (dueDate === "") {
      setDueDateError("Due Date is required");
      error = true;
    } else {
      setDueDateError("");
    }

    if (error) return;

    Swal.fire({
      title: "Update Task?",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal2-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          title: title,
          description: description,
          due_date: dueDate,
          status: status,
          _completed: isCompleted,
        };

        apiDefinitions
          .putUpdateTodo(taskID, payload)
          .then((res) => {
            if (res.data.status === 200) {
              toast.success(res.data.message);
              setShouldUpdate(true);
            } else {
              console.log("error");
              toast.error(`Error: ${res.data.message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error Updating task!");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Task Update Canceled", "", "info");
      }
    });
  };

  const handleComplete = (id) => {
    Swal.fire({
      title: "Do you want to complete this task?",
      showDenyButton: true,
      confirmButtonText: "Accept",
      denyButtonText: "Cancel",
      customClass: {
        popup: "swal2-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        apiDefinitions
          .putCompleteTodo(id)
          .then((res) => {
            if (res.data.status === 200) {
              toast.success("Todo Completed Successfully");
              setIsCompleted(true);
              setShouldUpdate(true);
            } else {
              console.log("error");
              toast.error(`Error: ${res.data.message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error Completing Todo!");
          });
      } else if (result.isDenied) {
        Swal.fire("Todo Completing Canceled", "", "info");
      }
    });
  };

  useEffect(() => {
    if (taskID !== "") {
      apiDefinitions
        .getTodoById(taskID)
        .then((res) => {
          if (res.data.status === 200) {
            const todo = res.data?.data;
            setTitle(todo?.title);
            setDescription(todo?.description);
            setDueDate(new Date(todo?.due_date).toISOString().split("T")[0]);
            setStatus(todo?.status);
          } else {
            toast.error(`Error: ${res.data.message}`);
          }
        })
        .catch((err) => {
          toast.error(`Error getting updated todo by ID`);
        });
    }
  }, [taskID]);

  useEffect(() => {
    if (shouldUpdate) {
      if (isCompleted || taskID !== "") {
        apiDefinitions
          .getTodoById(taskID)
          .then((res) => {
            if (res.data.status === 200) {
              const todo = res.data?.data;
              setTitle(todo?.title);
              setDescription(todo?.description);
              setDueDate(new Date(todo?.due_date).toISOString().split("T")[0]);
              setStatus(todo?.status);
            } else {
              toast.error(`Error: ${res.data.message}`);
            }
          })
          .catch((err) => {
            toast.error(`Error getting updated todo by ID`);
          });
      }
      setShouldUpdate(false);
    }
  }, [shouldUpdate, isCompleted, taskID]);

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item xs={12} sx={{ py: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
            }}
          >
            <Typography variant="h5">TODO Details for ID: {taskID}</Typography>
            <Button
              variant="contained"
              onClick={handleBack}
              startIcon={<Icon icon="icon-park-outline:back" />}
            >
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ px: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
              error={!!titleError}
              helperText={titleError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ fontSize: "20px" }}>
                    <Icon icon="ic:outline-title" />
                  </InputAdornment>
                ),
                readOnly: isCompleted,
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Description"
              required
              value={description}
              multiline
              rows={4}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError("");
              }}
              error={!!descriptionError}
              helperText={descriptionError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ fontSize: "20px" }}>
                    <Icon icon="fluent:text-description-16-filled" />
                  </InputAdornment>
                ),
                readOnly: isCompleted,
              }}
            />
          </Grid>
          <Grid item xs={4} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setDueDateError("");
              }}
              error={!!dueDateError}
              helperText={dueDateError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ fontSize: "20px" }}>
                    <Icon icon="fluent:calendar-16-filled" />
                  </InputAdornment>
                ),
                readOnly: isCompleted,
              }}
              inputProps={{
                min: getCurrentDate(),
              }}
            />
          </Grid>
          <Grid item xs={4} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Status"
              value={status}
              required
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ fontSize: "20px" }}>
                    <Icon icon="fluent:status-16-filled" />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Switch
                checked={isCompleted}
                onClick={() => handleComplete(taskID)}
                disabled={isCompleted}
              />
              <Typography variant="h6">Complete</Typography>
            </Box>
          </Grid>
          <Grid item xs={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleEdit}
              startIcon={<Icon icon="tabler:edit" />}
              disabled={isCompleted}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Task;
