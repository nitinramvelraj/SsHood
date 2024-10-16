import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import useApi from '../hooks/useApi';
import { setUser } from "../slices/userSlice";
import { AddBalance, ApiResponse, UserBasicInfo } from '../types/basicTypes';

interface AddMoneyProps {
  onSuccessfulAdd: () => void;
}

const AddMoney: React.FC<AddMoneyProps> = ({ onSuccessfulAdd }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("1");
  const [localError, setLocalError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { loading, error, callApi } = useApi();
  const user = useAppSelector((state) => state.user.basicInfo);

  const handleOpen = () => {
    setOpen(true);
    setLocalError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setAmount("1");
    setLocalError(null);
  };

  const handleAddMoney = async () => {
    setLocalError(null);

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setLocalError("Please enter a valid positive amount.");
      return;
    }

    if (!user || !user.id) {
      setLocalError("User information not found. Please try logging in again.");
      return;
    }

    const data: AddBalance = {
      user: user.id,
      credit: Number(amount),
    };

    try {
      const response: ApiResponse<UserBasicInfo> = await callApi('post', '/api/user/balance', data);
      dispatch(setUser({
        ...user,
        balance: response.data.balance
      }));
      
      onSuccessfulAdd();
      handleClose();
    } catch (e) {
      console.error("Failed to add money:", e);
      setLocalError("Failed to add money. Please try again.");
    }
  };

  return (
    <>
      <Button variant="contained" sx={{ ml: 1 }} onClick={handleOpen}>
        Add Money
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '10px',
            padding: '20px',
            width: '300px',
          },
        }}
      >
        <DialogContent>
          {(localError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || error}
            </Alert>
          )}
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="body1">Dollars:</Typography>
            <TextField
              autoFocus
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              InputProps={{
                inputProps: { 
                  min: 1,
                  style: { textAlign: 'center' }
                }
              }}
              sx={{ width: '100px' }}
            />
            <Button 
              onClick={handleAddMoney} 
              variant="contained" sx={{ ml: 1 }}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMoney;