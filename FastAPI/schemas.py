from pydantic import BaseModel
from typing import Optional

# Base schema with common attributes
class CarBase(BaseModel):
    make: str
    family: str
    year: int
    badges: str
    bodyType: str
    bodyTypeConfig: str
    fuelType: str
    transmission: str
    engine: float
    cylidners: int
    division: str
    drive: str
    seat: int
    doors: int
    odometer: int
    state: str
    saleCategory: str
    saleDate: str

# Schema for creating a new car entry
class CarCreate(CarBase):
    pass

# Schema for reading car data (includes id)
class CarRead(CarBase):
    id: int

    class Config:
        orm_mode = True