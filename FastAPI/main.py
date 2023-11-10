from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import cars

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(cars.router)

# default gateway
@app.get("/")
def read_root():
    return {"Welcome to my default api"}