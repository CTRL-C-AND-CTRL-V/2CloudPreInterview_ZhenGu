from typing import List
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db 
import models, schemas       
import time
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    tags=['Cars']
)

@router.get("/cars", response_model=List[schemas.CarRead])
def get_cars(db: Session = Depends(get_db)):
    return db.query(models.Car).all()