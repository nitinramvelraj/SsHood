import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { fetchUserBalance, searchStocks } from "../slices/homeSlice";
import { logout } from "../slices/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  Container,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddMoney from "./AddMoney";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const basicUserInfo = useAppSelector((state) => state.home.basicUserInfo);

  const refreshBalance = useCallback(() => {
    if (basicUserInfo?.id) {
      dispatch(fetchUserBalance(basicUserInfo.id));
    }
  }, [dispatch, basicUserInfo?.id]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchStocks(searchTerm));
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const buttonStyle = {
    width: '150px',
    height: '40px',
    color: "#ffa726",
    borderColor: "#ffa726",
    "&:hover": {
      backgroundColor: "#ffe0b2",
      borderColor: "#ff9800",
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#42a5f5" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            SellScaleHood
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            p: "2px 4px",
            mb: 2,
            width: "100%",
            borderRadius: "10px",
            border: "1px solid #ffa726",
          }}
        >
          <IconButton type="submit" sx={{ p: "10px" }}>
            <SearchIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ ml: 1 }}
          />
        </Paper>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/portfolio")}
            sx={buttonStyle}
          >
            Portfolio
          </Button>

          <Typography 
            variant="h6" 
            sx={{ 
              flex: 1,
              textAlign: 'center',
              fontWeight: "bold", 
              color: "#616161" 
            }}
          >
            Buying Power: ${basicUserInfo?.balance.toFixed(2)}
          </Typography>

          <AddMoney buttonStyle={buttonStyle} onSuccessfulAdd={refreshBalance} />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;