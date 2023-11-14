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
    

@router.get("/cars/filtered", response_model=List[schemas.CarRead])
def get_filtered_cars(
    make: str,
    family: str,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    odometer_start: Optional[int] = None,
    odometer_end: Optional[int] = None,
    sale_date_start: Optional[str] = None,
    sale_date_end: Optional[str] = None,
    badges: Optional[str] = None,
    bodyType: Optional[str] = None,
    bodyTypeConfig: Optional[str] = None,
    fuelType: Optional[str] = None,
    transmission: Optional[str] = None,
    engine: Optional[float] = None,
    cylinders: Optional[int] = None,
    division: Optional[str] = None,
    drive: Optional[str] = None,
    seat: Optional[int] = None,
    doors: Optional[int] = None,
    state: Optional[str] = None,
    saleCategory: Optional[str] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Start with a base query
    query = db.query(models.Car).filter(models.Car.make == make, models.Car.family == family)

    # Apply range filters
    if year_start and year_end:
        query = query.filter(models.Car.year.between(year_start, year_end))
    if odometer_start and odometer_end:
        query = query.filter(models.Car.odometer.between(odometer_start, odometer_end))
    if sale_date_start and sale_date_end:
        query = query.filter(models.Car.saleDate.between(sale_date_start, sale_date_end))

    # Apply filters for the rest of the parameters if they are provided
    if badges:
        query = query.filter(models.Car.badges == badges)
    if bodyType:
        query = query.filter(models.Car.bodyType == bodyType)
    if bodyTypeConfig:
        query = query.filter(models.Car.bodyTypeConfig == bodyTypeConfig)
    if fuelType:
        query = query.filter(models.Car.fuelType == fuelType)
    if transmission:
        query = query.filter(models.Car.transmission == transmission)
    if engine is not None:  # Use 'is not None' to allow filtering by '0'
        query = query.filter(models.Car.engine == engine)
    if cylinders:
        query = query.filter(models.Car.cylinders == cylinders)
    if division:
        query = query.filter(models.Car.division == division)
    if drive:
        query = query.filter(models.Car.drive == drive)
    if seat:
        query = query.filter(models.Car.seat == seat)
    if doors:
        query = query.filter(models.Car.doors == doors)
    if state:
        query = query.filter(models.Car.state == state)
    if saleCategory:
        query = query.filter(models.Car.saleCategory == saleCategory)
    if description:
        query = query.filter(models.Car.description.ilike(f"%{description}%"))

    # Execute the query and return the results
    try:
        cars = query.all()
        return cars
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))