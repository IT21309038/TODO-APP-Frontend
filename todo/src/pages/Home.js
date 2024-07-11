import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Card,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiDefinitions from "../api/apiDefinitions";

const Home = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [recordCount, setRecordCount] = useState(0);
  const [tableRefresh, setTableRefresh] = useState(false);

  const [addTodoOpen, setAddTodoOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [dueDateError, setDueDateError] = useState(false);

  const handleAddTodoOpen = () => {
    setAddTodoOpen(true);
  };

  const handleAddTodoClose = () => {
    setAddTodoOpen(false);
  };

  const handleSubmit = () => {
    let hasError = false;
    if (title.trim() === "") {
      setTitleError("Title is required");
      hasError = true;
    } else {
      setTitleError("");
    }
    if (description.trim() === "") {
      setDescriptionError("Description is required");
      hasError = true;
    } else {
      setDescriptionError("");
    }
    if (dueDate.trim() === "") {
      setDueDateError("Due Date is required");
      hasError = true;
    } else {
      setDueDateError("");
    }

    if (hasError) return;

    Swal.fire({
      title: "Create Task?",
      showCancelButton: true,
      confirmButtonText: "Create",
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
        };

        // console.log('Payload:', payload)

        apiDefinitions
          .postAddTodo(payload)
          .then((res) => {
            if (res.data.status === 201) {
              toast.success(res.data.message);
              handleAddTodoClose();
              setTableRefresh(!tableRefresh);
            } else {
              console.log("error");
              toast.error(`Error: ${res.data.message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error Creating task!");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Task Create Canceled", "", "info");
      }
    });
  };

  const handleEditTask = (id) => {
    navigate(`/task?id=${id}`);
  };

  const handleDeleteTask = (id) => {
    Swal.fire({
      title: "Do you want to delete this task?",
      showDenyButton: true,
      confirmButtonText: "Accept",
      denyButtonText: "Cancel",
      customClass: {
        popup: "swal2-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        apiDefinitions
          .deleteTodo(id)
          .then((res) => {
            if (res.data.status === 200) {
              toast.success("Todo Deleted Successfully");
              setTableRefresh(!tableRefresh);
            } else {
              console.log("error");
              toast.error(`Error: ${res.data.message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error Deleting Todo!");
          });
      } else if (result.isDenied) {
        Swal.fire("Todo Delete Canceled", "", "info");
      }
    });
  };

  const handleCompletedChange = (id) => {
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
              setTableRefresh(!tableRefresh);
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

  const columns = [
    {
      field: "title",
      headerName: "Title",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography variant="body2">{params.row.title || "N/A"}</Typography>
        );
      },
    },
    {
      field: "due_date",
      headerName: "Due Date",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        return (
          <Typography variant="body2">
            {formatDate(params.row.due_date)}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography variant="body2">{params.row.status || "N/A"}</Typography>
        );
      },
    },
    {
      field: "completed",
      headerName: "Completed",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row._completed}
            color="primary"
            edge="start"
            name="completed"
            onChange={() => handleCompletedChange(params.row.id)}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              my: 1,
              gap: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="view"
              color="primary"
              onClick={() => handleEditTask(params.row.id)}
            >
              <Icon icon="fluent:edit-16-regular" />
            </IconButton>
            <IconButton
              aria-label="view"
              color="primary"
              disabled={params.row.assign_status}
              onClick={() => handleDeleteTask(params.row.id)}
            >
              <Icon icon="fluent:delete-32-regular" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    apiDefinitions
      .getAllTodo()
      .then((res) => {
        if (res.data.status === 200) {
          setRows(res.data.data);
        } else {
          toast.error(`Error: ${res.data.message}`);
          setRows([]);
        }
      })
      .catch((err) => {
        toast.error("Error fetching data. Please try again.");
        setRows([]);
      });
  }, [tableRefresh]);

  return (
    <Grid container spacing={2} sx={{ mt: 5 }}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          <Typography variant="h5">TODO's</Typography>
          <Button
            variant="contained"
            onClick={handleAddTodoOpen}
            startIcon={<Icon icon="material-symbols-light:add" />}
          >
            Create TODO
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ mx: 2 }}>
          <Card sx={{ boxShadow: 2 }}>
            <Box
              sx={{
                height: 395,
                width: "100%",
                "& .actions": {
                  color: "text.secondary",
                },
                "& .textPrimary": {
                  color: "text.primary",
                },
              }}
            >
              <DataGrid
                getRowHeight={() => "auto"}
                rows={rows}
                rowCount={recordCount}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
              />
            </Box>
          </Card>
        </Box>
      </Grid>

      <Drawer anchor="right" open={addTodoOpen} onClose={handleAddTodoClose}>
        <Box width={400}>
          <Typography variant="h6" sx={{ px: 2, py: 2 }}>
            Add New ToDo
          </Typography>

          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                required
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
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Description"
                required
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
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                required
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
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{ px: 4 }}
                onClick={() => handleSubmit()}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </Grid>
  );
};

export default Home;
