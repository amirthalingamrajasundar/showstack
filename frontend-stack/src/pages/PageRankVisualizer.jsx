import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { 
  API_URL,
  DEFAULT_PAGE_NAMES,
  DEFAULT_CONNECTIVITY_MATRIX, 
  DEFAULT_TELEPORT_PROB, 
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_CONVERGENCE_THRESHOLD,
  DEFAULT_PAGE_RANK_RESULT
} from '../constants';

import PageRankConfigure from './PageRankConfigure';
import PageRankViewResut from './PageRankViewResult';

const PageRankVisualizer = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const [pageNames, setPageNames] = React.useState(DEFAULT_PAGE_NAMES);

  const [connectivityMatrix, setConnectivityMatrix] = React.useState(DEFAULT_CONNECTIVITY_MATRIX);

  const [teleportProb, setTeleportProb] = React.useState(DEFAULT_TELEPORT_PROB);

  const [maxIterations, setMaxIterations] = React.useState(DEFAULT_MAX_ITERATIONS);

  const [convergenceThreshold, setConvergenceThreshold] = React.useState(DEFAULT_CONVERGENCE_THRESHOLD);

  const [pageRankResult, setPageRankResult] = React.useState(DEFAULT_PAGE_RANK_RESULT);

  const handleChangeTabIndex = (event, newIndex) => {
      setTabIndex(newIndex);
  };

  // Handle input change for matrix
  const handleConnectivityMatrixChange = (row, col, value) => {
    const newMatrix = [...connectivityMatrix];
    newMatrix[row][col] = parseInt(value) || 0;
    setConnectivityMatrix(newMatrix);
  };

  const handleTeleportProbChange = (event) => {
      setTeleportProb(event.target.value);
  };

  const handleMaxIterationsChange = (event) => {
      setMaxIterations(event.target.value);
  };

  const handleConvergenceThresholdChange = (event) => {
      setConvergenceThreshold(event.target.value);
  };

  const computePageRank = async () => {
    // Validate and handle form submission
    console.log("computePageRank: ", connectivityMatrix);

    let isSuccess = true;

    const payload = {
      "connectivity_matrix": connectivityMatrix,
      "teleport_prob": teleportProb,
      "max_iter": maxIterations,
      "tolerance": convergenceThreshold,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('PageRank computation results:', data);
        setPageRankResult(data);
      } else {
        isSuccess = false;
        console.error('Failed to compute PageRank:', response.statusText);
      }
    } catch (error) {
      isSuccess = false;
      console.error('Error:', error);
    }
    return isSuccess;
  }

  return (
    <Box sx={{ width: '100%' }}>
        <Box>
          <Tabs value={tabIndex} onChange={handleChangeTabIndex}>
              <Tab icon={<SettingsRoundedIcon />} iconPosition='start' label="Configure" />
              <Tab icon={<PlayArrowRoundedIcon />} iconPosition='start' label="Visualize" />
          </Tabs>
        </Box>
        {tabIndex === 0 && <PageRankConfigure
          pageNames={pageNames} 
          connectivityMatrix={connectivityMatrix}
          handleConnectivityMatrixChange={handleConnectivityMatrixChange}
          teleportProb={teleportProb}
          handleTeleportProbChange={handleTeleportProbChange}
          maxIterations={maxIterations}
          handleMaxIterationsChange={handleMaxIterationsChange}
          convergenceThreshold={convergenceThreshold}
          handleConvergenceThresholdChange={handleConvergenceThresholdChange}
          computePageRank={computePageRank}
        />}
        {tabIndex === 1 && <PageRankViewResut
          pageNames={pageNames}
          connectivityMatrix={connectivityMatrix} 
          pageRankResult={pageRankResult}
          convergenceThreshold={convergenceThreshold}
        />}
    </Box>
  );
};

export default PageRankVisualizer;
