import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LearnAboutPageRank from "./LearnAboutPageRank";
import PageRankVisualizer from "./PageRankVisualizer";

const PageRank = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChangeTabIndex = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h2" gutterBottom>
                <Box component="span" sx={{ color: '#4285F4' }}>G</Box>
                <Box component="span" sx={{ color: '#EA4335' }}>o</Box>
                <Box component="span" sx={{ color: '#FBBC05' }}>o</Box>
                <Box component="span" sx={{ color: '#4285F4' }}>g</Box>
                <Box component="span" sx={{ color: '#34A853' }}>l</Box>
                <Box component="span" sx={{ color: '#EA4335' }}>e</Box>
                {' Page Rank'}
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleChangeTabIndex}>
                    <Tab label="About" />
                    <Tab label="Visualizer" />
                </Tabs>
            </Box>
            {tabIndex === 0 && <LearnAboutPageRank/>}
            {tabIndex === 1 && <PageRankVisualizer/>}
        </Box>
    );
};

export default PageRank;