import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname;

  const [value, setValue] = useState(currentTab || '/');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Configure Internet" value="/" />
        <Tab label="Visualization" value="/visualization" />
        <Tab label="Learn About PageRank" value="/learn" />
      </Tabs>
    </Box>
  );
};

export default TabNavigation;
