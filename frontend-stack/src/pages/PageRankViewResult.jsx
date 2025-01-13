import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import {SkipPrevious, SkipNext} from '@mui/icons-material';
import Graph from 'react-graph-vis';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@mui/material/Grid2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const PageRankViewResult = ({
    pageNames,
    connectivityMatrix,
    convergenceThreshold, 
    pageRankResult
}) => {
  const [currentIteration, setCurrentIteration] = useState(0);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [rankChangeData, setRankChangeData] = useState([]);
  const [pageRankTableData, setPageRankTableData] = useState([]);
  const graphOptions = {
        layout: {
            randomSeed: 20
        },
        edges: {
            arrows: "to",
        },
        physics: {
            enabled: true,  // Enable physics for node movement
            solver: 'forceAtlas2Based',  // Use a force-directed layout
            forceAtlas2Based: {
                gravitationalConstant: -50,  // Adjust for spreading nodes
                centralGravity: 0.01,  // Set central gravity to 0.01 for more spread
                springLength: 150,  // Increase to spread nodes further apart
                springConstant: 0.08  // Adjust to control spring strength
            }
        },
        width: "100%",
        height: "100%",
    };

  useEffect(() => {

    // Build the graph data for the current iteration
    const iterationResult = pageRankResult.iterations[currentIteration];
    const nodes = pageNames.map((pageName, index) => ({
        id: index,
        label: `${pageName}\n${(parseFloat(iterationResult.rank[index]) * 100).toFixed(4) }%`,
        size: iterationResult.rank[index] * 100,
        color: `rgb(0, ${255 - iterationResult.rank[index] * 255}, 0)`,
        key: index
    }));
    const edges = connectivityMatrix.reduce((acc, row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 1) {
                acc.push({ from: rowIndex, to: colIndex });
            }
        });
        return acc;
    }, []);
    setGraph({ nodes, edges });

    // Build the rank change graph data
    const rankChangeData = [];
    for (let i = 0; i <= currentIteration; i++) {
        const iteration = pageRankResult.iterations[i];
        let data = {
            name: `Iteration ${iteration.iteration}`,
        };
        for (let i = 0; i < iteration.rank.length; i++) {
            data[pageNames[i]] = iteration.rank[i];
        }
        data['error'] = iteration.error;
        rankChangeData.push(data);
    }
    setRankChangeData(rankChangeData);

    const pageRankTableData = pageNames.map((pageName, index) => ({
        page: pageName,
        rank: pageRankResult.iterations[currentIteration].rank[index],
        index: index
    }));
    
    pageRankTableData.sort((a, b) => b.rank - a.rank);
    setPageRankTableData(pageRankTableData);

  }, [currentIteration]);

  const getColor = (index) => `hsl(${(index / 10) * 360}, 70%, 50%)`;

  return (
    <Box sx={{ padding: 3 }}>
        <Typography variant="body1" gutterBottom>
            Use the buttons in the bottom right corner to step through each iteration to see how the PageRank values evolve for each page in the connectivity matrix.
        </Typography>
        <Box 
            position= "fixed"
            bottom= "5px"
            right= "5px" 
            display="flex" 
            justifyContent="left"
            zIndex="1000"
            sx={{ 
                marginBottom: 5
             }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setCurrentIteration(currentIteration - 1)}
                disabled={currentIteration === 0}
                startIcon={<SkipPrevious />}
                sx={{ marginRight: 2 }}
            >
                Previous
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setCurrentIteration(currentIteration + 1)}
                disabled={currentIteration === pageRankResult.iterations.length - 1}
                endIcon={<SkipNext />}
            >
                Next
            </Button>
        </Box>
        <Grid container spacing={2} width="100%">
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Typography variant="h1" gutterBottom sx={{fontSize: '25px'}}>
                        Iteration: {currentIteration + 1}
                    </Typography>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Typography variant="h1" gutterBottom sx={{fontSize: '25px'}}>
                        Error: {
                            Number.isFinite(pageRankResult.iterations[currentIteration].error) ?
                            parseFloat(pageRankResult.iterations[currentIteration].error).toFixed(5) :
                            "NA"
                        }
                </Typography>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Typography variant="h1" gutterBottom sx={{fontSize: '25px'}}>
                        Is Converged ? 
                        <span
                            style={{
                                color: parseFloat(pageRankResult.iterations[currentIteration].error) <= parseFloat(convergenceThreshold) ? 'green' : 'red'
                            }}
                        >
                            {parseFloat(pageRankResult.iterations[currentIteration].error) <= parseFloat(convergenceThreshold) ? " Yes" : " No"}
                        </span>
                    </Typography>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Graph 
                        key={uuidv4()} 
                        graph={graph} 
                        options={graphOptions} 
                        style={{ height: "600px", width: "100%"}}
                    />
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Box sx={{width: "100%", textAlign: "center"}}>
                        <Typography variant="overline" sx={{textAlign: "center"}} gutterBottom>
                            Rank Change Over Iterations
                        </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={568}>
                        <LineChart
                            width={500}
                            height={300}
                            data={rankChangeData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {pageNames.map((pageName, index) => (
                                <Line 
                                    type="monotone" 
                                    dataKey={pageName}
                                    stroke={getColor(index)}
                                    activeDot={{ r: 8 }}
                                    key={pageName} 
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Box sx={{width: "100%", textAlign: "center"}}>
                        <Typography variant="overline" sx={{textAlign: "center"}} gutterBottom>
                            Error Convergence Over Iterations
                        </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={568}>
                        <LineChart
                            width={500}
                            height={300}
                            data={rankChangeData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="error"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TableContainer component={Paper} sx={{height: "600px", padding: "20px"}}>
                    <Box sx={{width: "100%", textAlign: "center", marginTop: "5px"}}>
                    <Typography variant="overline" gutterBottom sx={{ paddingTop: 2, textAlign: "center" }}>
                        Page Rank Table
                    </Typography>
                    </Box>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="center"><strong>Page Rank</strong></TableCell>
                            <TableCell align="center"><strong>Page Name</strong></TableCell>
                            <TableCell align="center"><strong>% time spent</strong></TableCell>
                            <TableCell align="center"><strong>Page Index</strong></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {pageRankTableData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell key={`${index}-cell1`} align="center">{index + 1}</TableCell>
                                <TableCell key={`${index}-cell2`} align="center">{row.page}</TableCell>
                                <TableCell key={`${index}-cell3`} align="center">{(parseFloat(row.rank * 100)).toFixed(4)}%</TableCell>
                                <TableCell key={`${index}-cell4`} align="center">{row.index + 1}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </Box>
  );
};

export default PageRankViewResult;