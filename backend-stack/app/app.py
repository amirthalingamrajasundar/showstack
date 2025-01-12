from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import PageRankInput, PageRankOutput
from app.pagerank import compute_pagerank
import logging

logging.basicConfig(level=logging.DEBUG)

app = FastAPI(debug=True)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/compute-pagerank", response_model=PageRankOutput)
def compute_pagerank_service(input_data: PageRankInput):
    try:
        logging.debug(f"Received input: {input_data}")
        return compute_pagerank(input_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e.with_traceback()))
