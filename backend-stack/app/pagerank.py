import numpy as np
import logging
logging.basicConfig(level=logging.DEBUG)

def getTransitionProbabilityMatrix(G, p):
  A = np.copy(G)
  n = A.shape[0]
  # Dangling nodes are nodes with no outgoing links
  # Dangling nodes can act as dead ends while traversing the internet represented by G
  # Handle dangling nodes by setting their outgoing links to uniform distribution
  dangling_nodes = np.where(A.sum(axis=0) == 0)[0]
  col_sums = np.array(A.sum(axis=0)).flatten()
  for i in range(0, n):
    if (i in dangling_nodes):
      # uniform distribution of transition probability
      A[:, i] = 1 / n
    else:
      A[:, i] = (A[:, i] * (p / col_sums[i])) + (1-p) / n
  return A

# PageRank Algorithm
def pageRank(G, p=0.85, epsilon=1e-4, max_iter=100):
    logging.debug(f"Executing pageRank: {G}")
    A = getTransitionProbabilityMatrix(G, p)
    n = A.shape[0]
    # Initial page rank vector
    x = np.ones(n) / n
    iterations = [{
       'iteration': 0,
       'rank': x.tolist()
    }]
    isConvergenceReached = False
    for k in range(max_iter):
        x_new = A @ x
        error = np.linalg.norm(x_new - x, ord=1)
        iterations.append({
           'iteration': k + 1,
           'rank': x_new.tolist(),
           'error': error
        })
        if error < epsilon:
            isConvergenceReached = True
            break
        x = x_new
    return {
        'iterations': iterations,
        'convergence_reached': isConvergenceReached
    }

#
def compute_pagerank(input_data):
    G = np.array(input_data.connectivity_matrix, dtype=float)
    return pageRank(
       G,
       1 - float(input_data.teleport_prob), 
       input_data.tolerance, 
       input_data.max_iter
    )