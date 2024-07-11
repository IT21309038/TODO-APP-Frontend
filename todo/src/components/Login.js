import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiDefinitions from "../api/apiDefinitions";
import LoginImg from "../assets/login.jpg";
import { useAuth } from "../auth/Auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = () => {
    let hasError = false;
    if (userName.trim() === "") {
      setUserNameError("Username is required");
      hasError = true;
    } else {
      setUserNameError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    const payload = {
        username: userName,
        password: password,
    };

    apiDefinitions
      .postLogin(payload)
      .then((res) => {
        if (res.status === 200) {
          const token = res.data.accessToken;
          localStorage.setItem("token", token);
          toast.success("Login Successful!");
          login();
        } else {
          console.log("error");
          toast.error(`Error: Login Failed!`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error Logging In!");
      });
};

  return (
    <>
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box width="50%">
          <img src={LoginImg} alt="login" style={{ width: "100%" }} />
        </Box>
        <Box width="50%">
          <Grid container spacing={2} sx={{ py: 2, px: 2 }}>
            <Typography variant="h4" align="center" sx={{ my: 2, mx: 2 }}>
              Login
            </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                required
                onChange={(e) => {
                  setUserName(e.target.value);
                  setUserNameError("");
                }}
                error={!!userNameError}
                helperText={userNameError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ fontSize: "20px" }}>
                      <Icon icon="solar:user-linear" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ fontSize: "20px" }}>
                      <Icon icon="mdi:eye-off" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ px: 4 }}
                onClick={() => handleLogin()}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Login;
