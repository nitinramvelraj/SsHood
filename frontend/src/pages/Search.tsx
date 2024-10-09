import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import useApi from '../hooks/useApi';
import { SearchResult } from '../types/basicTypes';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { callApi, loading, error } = useApi();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [shares, setShares] = useState<number>(1);

  const searchParams = new URLSearchParams(location.search);
  const ticker = searchParams.get('ticker') || '';

  const handleSearch = async () => {
    try {
      const response = await callApi('get', `/api/user/search?ticker=${ticker}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleBuy = async () => {
    try {
      await callApi('post', '/api/user/buy', { ticker, num_shares: shares });
      navigate('/');
    } catch (error) {
      console.error('Buy failed:', error);
    }
  };

  const handleSell = async () => {
    try {
      await callApi('post', '/api/user/sell', { ticker, num_shares: shares });
      navigate('/');
    } catch (error) {
      console.error('Sell failed:', error);
    }
  };

  useEffect(() => {
    if (ticker) {
      handleSearch();
    }
  }, [ticker]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Search Results for {ticker.toUpperCase()}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {searchResult && (
          <Box>
            <Typography>Name: {searchResult.name}</Typography>
            <Typography>Price: ${searchResult.price.toFixed(2)}</Typography>
            <Typography>Current Position: {searchResult.currentPosition}</Typography>
            <Typography>Current Position Value: ${searchResult.currentPositionValue.toFixed(2)}</Typography>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Shares"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid size={6}>
                  <Button
                    fullWidth
                    onClick={handleBuy}
                    variant="contained"
                    color="primary"
                  >
                    BUY
                  </Button>
                </Grid>
                <Grid size={6}>
                  <Button
                    fullWidth
                    onClick={handleSell}
                    variant="contained"
                    color="primary"
                    disabled={searchResult.currentPositionValue <= 0}
                  >
                    SELL
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Search;