from typing import List
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
# from .. import models, schemas
# from ..database import get_db
import time
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    prefix="/cars",
    tags=['Cars']
)