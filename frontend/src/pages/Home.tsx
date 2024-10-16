import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Navigate, useNavigate } from 'react-router-dom';
import AddMoney from './AddMoney';
import useApi from '../hooks/useApi';
import { ApiResponse } from '../types/basicTypes';
import { PortfolioItem } from '../types/basicTypes';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { clearUser } from '../slices/userSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { callApi } = useApi();
  const [portfolio, setPortfolio] = useState<PortfolioItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTicker, setSearchTicker] = useState<string>('');

  const user = useAppSelector((state) => state.user.basicInfo);

  const fetchPortfolio = useCallback(async () => {
    try {
      const response = await callApi('get', '/api/user/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  useEffect(() => {
    setLoading(true);
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleSuccessfulAddMoney = () => {
    fetchPortfolio();
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?ticker=${searchTicker}`);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexGrow: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            Search
          </Button>
        </Box>
          <Button variant="outlined" disabled>
            Buying Power: ${user.balance.toFixed(2)}
          </Button>
          <AddMoney onSuccessfulAdd={handleSuccessfulAddMoney} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Portfolio
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : portfolio && portfolio.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Ticker</TableCell>
                  <TableCell>Shares</TableCell>
                  <TableCell align="right">Value</TableCell> 
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio.map((item) => (
                  <TableRow key={item.stock_id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.ticker}</TableCell>
                    <TableCell>{item.num_shares}</TableCell>
                    <TableCell align="right">${item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No stocks in portfolio.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Home;