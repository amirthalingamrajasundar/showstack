import React from 'react';
import { 
  TextField, 
  Button,
  Paper,
  Box,
  Typography, 
  Checkbox, 
  Snackbar, 
  Alert,
  Backdrop,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

const PageRankConfigure = ({
  pageNames,
  connectivityMatrix,
  handleConnectivityMatrixChange,
  teleportProb,
  handleTeleportProbChange,
  maxIterations,
  handleMaxIterationsChange,
  convergenceThreshold,
  handleConvergenceThresholdChange,
  computePageRank
}) => {
  const [error, setError] = React.useState({
    teleportProb: false,
    maxIterations: false,
    convergenceThreshold: false
  });
  const [alertInfo, setAlertInfo] = React.useState({
    open: false,
    message: "",
    severity: "error"
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = () => {
    // Validate form fields
    let isValid = true;
    let error = {
      teleportProb: false,
      maxIterations: false,
      convergenceThreshold: false
    };
    if (teleportProb < 0 || teleportProb > 1) {
      isValid = false;
      error.teleportProb = true;
    }
    if (maxIterations < 1 || maxIterations > 100 || !Number.isInteger(parseFloat(maxIterations))) {
      isValid = false;
      error.maxIterations = true;
    }
    if (convergenceThreshold < 0 || convergenceThreshold > 1) {
      isValid = false;
      error.convergenceThreshold = true;
    }
    if (!isValid) {
      setError(error);
    }
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate and handle form submission
    let isValid = validateForm();
    if (isValid) {
      setError({
        teleportProb: false,
        maxIterations: false,
        convergenceThreshold: false
      });
      setIsLoading(true);
      let isSuccess = await computePageRank();
      setIsLoading(false);
      if (isSuccess) {
        setAlertInfo({
          open: true,
          message: "PageRank computation successful! Check the results in the 'Visualize' tab.",
          severity: "success"
        });
      }
      else {
        setAlertInfo({
          open: true,
          message: "PageRank computation failed! Please retry.",
          severity: "error"
        });
      }
    }
    else {
      setAlertInfo({
        open: true,
        message: "Please fix the errors in the input.",
        severity: "error"
      });
      setTimeout(() => {
        setAlertInfo({
          open: false,
          message: "",
          severity: ""
        });
      }, 3000);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Connectivity Matrix
      </Typography>
      <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
        The connectivity matrix 'G' represents the mini internet that we will run the Page Rank algorithm on.
        If 'G[i][j]' is checked, then there is a link from page 'j' to page 'i'.
        The rows of the matrix represent the in-links for the i th page.
        The columns of the matrix represent the out-links for the j th page.
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Create an empty cell to align the header with the body */}
              <TableCell></TableCell>
              {/* Create cells for page indices (0 to 9) */}
              {Array.from({ length: pageNames.length }, (_, index) => (
                <TableCell key={index}>{pageNames[index]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render each row of the connectivity matrix */}
            {connectivityMatrix.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Row label (Page Details) */}
                <TableCell>{pageNames[rowIndex]}</TableCell>
                {/* Render checkboxes in each cell for connectivity */}
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex}>
                    <Checkbox
                      checked={cell === 1}
                      onChange={(e) => handleConnectivityMatrixChange(rowIndex, colIndex, e.target.checked ? 1 : 0)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Typography variant="h6" gutterBottom>
        Teleportation probability
      </Typography>
      <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
        Teleportation probability is the probability with which the user will randomly jump to any page in the mini internet.
      </Typography>
      <TextField
        error={error.teleportProb}
        helperText="Enter a decimal number between 0 and 1"
        type="number"
        variant="outlined"
        value={teleportProb}
        onChange={handleTeleportProbChange}
        sx={{ width: 300 }}
      />
      <br />
      <br />
      <Typography variant="h6" gutterBottom>
        Maximum number of iterations
      </Typography>
      <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
        The maximum number of iterations the Page Rank algorithm will run for.
      </Typography>
      <TextField
        error={error.maxIterations}
        helperText="Enter an integer between 1 and 100"
        type="number"
        variant="outlined"
        value={maxIterations}
        onChange={handleMaxIterationsChange}
        sx={{ width: 300 }}
      />
      <br />
      <br />
      <Typography variant="h6" gutterBottom>
        Convergence threshold
      </Typography>
      <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
        Convergence threshold is the minimum change in Page Rank score between iterations for the algorithm to stop.
      </Typography>
      <TextField
        error={error.convergenceThreshold}
        helperText="Enter a decimal number between 0 and 1"
        type="number"
        variant="outlined"
        value={convergenceThreshold}
        onChange={handleConvergenceThresholdChange}
        sx={{ width: 300 }}
      />
      <br />
      <Box mt={2} display="flex" justifyContent="left">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ width: 200 }}
        >
          Save
        </Button>
      </Box>
      <Snackbar
        open={alertInfo.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={() => setAlertInfo({ open: false, message: "", severity: "" })}
      >
        <Alert 
          severity={alertInfo.severity}
          variant='filled' 
          sx={{
            fontSize: '1rem',
            padding: '10px',
            borderRadius: '8px',
            minWidth: '300px'
          }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ 
          color: '#e0e0e0', 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)'
        })}
        open={isLoading}
        onClick={() => setIsLoading(false)}
      >
        <CircularProgress size="3rem" message="Computing Page Rank" />
      </Backdrop>
    </Box>
  );
};

export default PageRankConfigure;
