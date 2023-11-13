from typing import List
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db 
import models, schemas       
import time
from sqlalchemy.exc import IntegrityError
from typing import List, Optional

router = APIRouter(
    tags=['Cars']
)

@router.get("/cars", response_model=List[schemas.CarRead])
def get_cars(make: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Car)
    if make:
        query = query.filter(models.Car.make == make)
    return query.all()

@router.post("/cars", response_model=List[schemas.CarRead], status_code=status.HTTP_201_CREATED)
def create_cars(cars: List[schemas.CarCreate], db: Session = Depends(get_db)):
    new_cars = [models.Car(**car.dict()) for car in cars]
    db.add_all(new_cars)
    try:
        db.commit()
        return new_cars
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))