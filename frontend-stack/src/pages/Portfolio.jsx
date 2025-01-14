import React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Link, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Email, LinkedIn, GitHub, Code, School, SportsEsports } from '@mui/icons-material';
import { PROFILE_LINKS } from '../constants';

const Portfolio = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'left',
          flex: 1,
          padding: 4,
        }}
      >
        <Typography variant="h1" gutterBottom>
          Hello World! <span role="img" aria-label="waving hand">👋</span>
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 4, backgroundColor: '#ffffff', padding: 4 }}>

        {/* Introduction */}
        <Typography variant="h4" gutterBottom>
          About Me
        </Typography>
        <Typography variant="body1" gutterBottom>
        I am Amirthalingam Rajasundar, a Senior Software Engineer with over 5 years of experience specializing in backend development and building scalable web applications. I am proficient in modern technologies such as AWS, Java, NodeJS, React, and cloud-native applications. I enjoy designing and developing innovative solutions that make a difference. My goal is to leverage my technical expertise and passion for software development to drive innovation.
        </Typography>

        {/* Skills */}
        <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
          Skills
        </Typography>
        <Grid container spacing={2}>
          {['Java', 'JavaScript', 'Python', 'AWS', 'React', 'PostgreSQL', 'Oracle', 'Spring', 'Perl'].map((skill) => (
            <Grid xs={6} sm={4} key={skill}>
              <Chip label={skill}/>
            </Grid>
          ))}
        </Grid>

        {/* Education */}
        <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
          Education
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText
              primary="Masters in Artificial Intelligence"
              secondary="Indian Institute of Science, IN, 2024 – present"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText
              primary="Bachelors in Computer Science and Engineering"
              secondary="Thiagarajar College Of Engineering, IN, 2015 – 2019"
            />
          </ListItem>
        </List>

        {/* Projects */}
        <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
          Projects
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Code />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  href="/page-rank"
                  target="_blank"
                  underline="hover"
                >
                  PageRank Visualizer
                </Link>
              }
              secondary="A web application demonstrating the PageRank algorithm with interactive visualizations and charts."
            />
          </ListItem>
        </List>

        {/* Interests */}
        <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
          Interests
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText
              primary="Building Applications"
              secondary="Exploring tech and building applications"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SportsEsports />
            </ListItemIcon>
            <ListItemText
              primary="Gaming"
              secondary="I am playing 'Enshrouded'."
            />
          </ListItem>
        </List>
      </Box>

      {/* Footer */}
      <AppBar position="static" component="footer" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <IconButton
            href={`mailto:${PROFILE_LINKS.email}`}
            color="inherit"
            aria-label="email"
            sx={{ marginX: 1 }}
          >
            <Email />
          </IconButton>
          <IconButton
            href={PROFILE_LINKS.linkedin}
            color="inherit"
            aria-label="LinkedIn"
            sx={{ marginX: 1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            href={PROFILE_LINKS.github}
            color="inherit"
            aria-label="GitHub"
            sx={{ marginX: 1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Portfolio;
