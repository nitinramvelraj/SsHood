import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { addUserBalance } from "../slices/homeSlice";

interface AddMoneyProps {
  buttonStyle: React.CSSProperties;
  onSuccessfulAdd: () => void;
}

const AddMoney: React.FC<AddMoneyProps> = ({ buttonStyle, onSuccessfulAdd }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");

  const dispatch = useAppDispatch();
  const basicUserInfo = useAppSelector((state) => state.home.basicUserInfo);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddMoney = async () => {
    if (amount && basicUserInfo) {
      const data = {
        credit: parseFloat(amount),
        user: basicUserInfo.id,
      };
      try {
        await dispatch(addUserBalance(data)).unwrap();
        onSuccessfulAdd(); // Call the callback function after successful addition
        setOpen(false);
        setAmount(""); // Reset the amount
      } catch (error) {
        console.error("Failed to add money:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        sx={buttonStyle}
      >
        Add Money
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Balance</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddMoney} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddMoney;