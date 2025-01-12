from pydantic import BaseModel, Field
from typing import List, Annotated, Optional

class PageRankInput(BaseModel):
    connectivity_matrix: Annotated[
        List[Annotated[List[int], Field(min_length=3, max_length=10)]],
        Field(min_length=3, max_length=10)
    ]
    teleport_prob: Annotated[float, Field(ge=0.0, le=1.0)]  # Must be between 0 and 1
    max_iter: Annotated[int, Field(gt=0)]  # Must be a positive integer
    tolerance: Annotated[float, Field(gt=0)]  # Must be a positive float

class IterationData(BaseModel):
    iteration: int
    rank: List[float]
    error: Optional[float] = None

class PageRankOutput(BaseModel):
    iterations: List[IterationData]
    convergence_reached: bool