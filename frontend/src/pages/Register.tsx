import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Alert
  } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";

const Register = () => {
    const dispatch = useAppDispatch();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validatePassword = (password: string) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async () => {
        if (!firstname || !lastname || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
      
        if (!validatePassword(password)) {
            setError(
              "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
            );
            return;
        }
        try {
            await dispatch(
              register({
                firstname,
                lastname,
                email,
                password,
              })
            ).unwrap();
        } catch (e) {
            setError(`Error signing in: ${e instanceof Error ? e.message : String(e)}`);
        }
    };

    return (
        <>
        <Container maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                mt: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: "warning.light" }}>
                <LockOutlined />
            </Avatar>
            <Typography variant="h5">Register</Typography>
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                    name="firstname"
                    required
                    fullWidth
                    id="firstname"
                    label="First name"
                    autoFocus
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                    name="lastname"
                    required
                    fullWidth
                    id="lastname"
                    label="Last name"
                    autoFocus
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                    required
                    fullWidth
                    size="medium"
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                </Grid>
                <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleRegister}
                >
                Register
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid>
                    <Link to="/login">Already have an account? Login</Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
        </>
    );
};

export default Register;