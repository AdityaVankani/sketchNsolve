

from contextlib import asynccontextmanager
from fastapi import  FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from constants import SERVER_URL, PORT, ENV 
from app.calc.route import router as calc_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)   

origins = [
    "http://localhost:5173",
    "https://sketchnsolvefrontend.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    # print("Health Check")
    return {"status": "ok"}

app.include_router(calc_router, prefix="/calc",tags=["calc"])

if __name__ == "__main__":
    uvicorn.run('main:app', host=SERVER_URL, port=int(PORT), reload=(ENV == 'dev'))



