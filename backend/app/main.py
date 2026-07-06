from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
from app.routers import items
from app.routers import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

app.include_router(items.router)
app.include_router(auth.router)







