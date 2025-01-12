import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const LearnAboutPageRank = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant='body2' sx={{fontSize: "15px"}}>
        This section will try to explain Page Rank algorithm in an easy to understand way. 
        I learnt this algorithm in Linear Algebra course under the instruction of <a href='https://ece.iisc.ac.in/~spchepuri/'>Sundeep</a> during my MTech at IISc.
        It uses concepts like Eigen value, Eigen vector, Norms, Stochastic matrices, Perron Forbenius theorem, Power Iterations etc from Linear Algebra and concepts like Probability, Product probability, Markov Chains etc from Random Processes.
        If you want to see the algorithm in action, jump to the 'Visualizer' tab.      
      </Typography>
      <br/>
      <br/>
      <Typography variant="h1" sx={{fontSize: "25px"}} gutterBottom>
        What is PageRank?
      </Typography>
      <Typography variant="body1">
        During the early days of Internet, Google developed the Page Rank algorithm to rank web pages based on their importance to help with ordering search results.
        It models the behavior of a random surfer clicking on links, assigning higher scores to pages that are linked to by many other important pages.
      </Typography>
      <br/>
      <br/>
      <Typography variant="h1" sx={{fontSize: "25px"}} gutterBottom>
          How does PageRank Work?
      </Typography>
      <Typography variant="body1">
        Let's first see what the input for the algorithm is.
      </Typography>
      <Typography component="ol">
        <Typography component="li" variant="body1">
          <strong>Connectivty Matrix: </strong> The connectivity matrix 'G' models the mini internet that we will run the Page Rank algorithm on. Let 'n' be the number of pages. The network is represented using an adjaceny matrix. The matrix G can be huge, but it is often very sparse . If 'G[i][j]' is 1, then there is a link from page 'j' to page 'i'. The rows of the matrix represent the in-links for the i th page. The columns of the matrix represent the out-links for the j th page. The visualizer restricts the number of pages to 10 for brevity. The following is a sample connectivity matrix.
        </Typography>
        <Box sx={{textAlign: "center", marginBottom: "5px"}}>
          <img src='connectivity_matrix.png' alt='connectivity_matrix' width="800px" height="150px"/>
        </Box>
        <Typography component="li" variant="body1">
          <strong>Link follow probability: </strong> The Link follow  probability 'p' the probability with which the user follows a link from the current page. This is also '1 - teleportProb'. This is a decimal number between 0 and 1. The visualizer sets this value to the default of '0.85'. But, this can be changed in the 'Configure' tab.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Teleportation probability: </strong> Teleportation probability '1-p' is the probability with which the user will randomly jump to any page in the mini internet. This is a decimal number between 0 and 1. The visualizer sets this value to the default of '0.15'. But, this can be changed in the 'Configure' tab.
        </Typography>
        <Typography component="li" variant="body1">
        <strong>Maximum number of iterations: </strong> The maximum number of iterations the Page Rank algorithm will run for. The visualizer sets this value to the default of '100'. But, this can be changed in the 'Configure' tab.
        </Typography>
        <Typography component="li" variant="body1">
        <strong>Convergence Threshold: </strong> Convergence threshold is the minimum change in Page Rank score between successive iterations for the algorithm to stop. The visualizer sets this value to the default of '0.0001'. But, this can be changed in the 'Configure' tab.
        </Typography>
      </Typography>
      <br/>
      <Typography variant="body1">
        Now let's see how the input is used to calculate Page Rank.
      </Typography>
      <Typography component="ul">
        <Typography component="li" variant="body1">
          <strong>Step 1:</strong> Calculate the Transition Probability matrix 'A'. The transition probability matrix is calculated using the connectivity matrix 'G', number of pages 'n', link follow probability 'p' and teleportation probability '1-p'. The quantity out-degree of the jth page is the column sum of the connectivity matrix 'G', i.e.,<InlineMath math="c_j = \sum_i g_{ij}" />
          The (i, j)th entry of the transition probability matrix 'A' is defined by the following formula.
          <BlockMath math={`a_{ij} =
        \\begin{cases}
        \\frac{p g_{ij}}{c_j} + \\frac{1-p}{n}, & \\text{if } c_j \\neq 0, \\\\
        \\frac{1}{n}, & \\text{if } c_j = 0.
        \\end{cases}`} />
          The 'j'th column is the probability of jumping from the 'j'th page to the other pages on the
Web. If the jth page is a dead end with no out-links, then we assign a uniform probability
of '1/n' to all the elements in its column. The matrix 'A' represents the Markov Chain's transition probability matrix and the Perron vector or the eigenvector 'x' associated to the leading
eigenvalue of 'A', i.e., the vector 'x' that satisfies 'Ax = x' with a scaling factor <InlineMath math="1^T x = 1" /> is the Google’s PageRank.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Step 2:</strong> Perform power iterations. Let <InlineMath math="x_0" /> be the initial vector. The initial vector is formed by assuming that the probability of visting each page is equal. So, all the 'n' positions in <InlineMath math="x_0" /> is set to '1/n'. The power iteration method involves computing the matrix vector product for 'k=0,1,...'.
          <BlockMath math={"x_{k+1} = A x_k"} />
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Step 3:</strong> Calculate the L1 norm of the difference between the resultant vector <InlineMath math="x_{k+1}" /> and the previous vector <InlineMath math="x_k" />. For a vector{" "} <InlineMath math="x = [x_1, x_2, \dots, x_n] \in \mathbb{R}^n" />, the L1 norm is defined as: 
          <BlockMath math="\|x\|_1 = \sum_{i=1}^n |x_i|" />
          Where:
          <ul>
            <li>
              <InlineMath math="x_i" /> are the components of the vector{" "}
              <InlineMath math="x" />.
            </li>
            <li>
              <InlineMath math="|x_i|" /> denotes the absolute value of{" "}
              <InlineMath math="x_i" />.
            </li>
          </ul> 
          Check if the error is less than the convergence threshold.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Step 4:</strong> Goto 'Step 2' if the error is greater than the convergence threshold. Else, stop the algorithm and return the resultant vector. 
        </Typography>
      </Typography>
      <br/>
      <br/>
      <Typography variant="h1" sx={{fontSize: "25px"}} gutterBottom>
        Why does PageRank Work?
      </Typography>
      <Typography variant="body1">
        By construction, the Transition probability matrix 'A' is a Markov matrix. A matrix is a Markov matrix if it satisfies the following conditions.
      </Typography>
      <Typography component="ol">
        <Typography component="li" variant="body1">
          <strong>Non-negativity: </strong> Each element of the matrix should be greater than or equal to 0. The transition probability matrix 'A' satisfies this condition as each cell represents a probability and probability is always between 0 and 1.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Column stochastic: </strong> The sum of the values in each column in the matrix should be 1. The transition probability matrix 'A' also satisfies this condition as each column represents the probability of navigating from the current page to the next page. The probability of navigating away from the current page is always 1 by construction as we eliminated dead ends and normalized the transition probability matrix in 'Step 1'.
        </Typography>
      </Typography>
      <Typography variant="body1">
        The maximum eigen value of a Markov matrix is 1. If we substitute it in the equation <InlineMath math={"A\\mathbf{{x}} = \\lambda\\mathbf{{x}}"} />, we get <InlineMath math={"A\\mathbf{{x}} = \\mathbf{{x}}"} />. So, when we find the maximum eigen value using power iteration method, <InlineMath math='x_{k+1}' /> will be equal to <InlineMath math='x_{k}'/>. So, convergence is guaranteed. This shows that the Page Rank algorithm is guaranteed to produce a solution.
      </Typography>
      <br/>
      <br/>
      <Typography variant='body1'>
        Now, that you know how the PageRank algorithm works, head to the 'Visualizer' tab and experiment. 
      </Typography>
    </Box>
  );
};

export default LearnAboutPageRank;