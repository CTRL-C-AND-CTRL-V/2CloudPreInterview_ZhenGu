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
def get_cars(
    make: Optional[str] = None, 
    family: Optional[str] = None, 
    year: Optional[int] = None, 
    db: Session = Depends(get_db)
):
    # Start with a base query
    query = db.query(models.Car)
    
    # Apply filters only if all are provided
    if make and family and year:
        query = query.filter(models.Car.make == make, 
                             models.Car.family == family, 
                             models.Car.year == year)
    elif make and family and not year:
        query = query.filter(models.Car.make == make, 
                        models.Car.family == family)
    # If only maker is provided, just filter by maker
    elif make and not family and not year:
        query = query.filter(models.Car.make == make)
    # If family or year are provided without maker, raise an error
    elif family or year:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Filtering by model or year requires maker to be specified."
        )

    # Return the filtered list of cars
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