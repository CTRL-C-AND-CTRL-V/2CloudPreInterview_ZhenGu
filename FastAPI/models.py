from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    #name = Column(String)
    make = Column(String)
    family = Column(String)
    year = Column(Integer)
    badges = Column(String)
    bodyType = Column(String)
    bodyTypeConfig = Column(String)
    fuelType = Column(String)
    transmission = Column(String)
    engine = Column(Float)
    cylidners = Column(Integer)
    division = Column(String)
    drive = Column(String)
    seat = Column(Integer)
    doors = Column(Integer)
    odometer = Column(Integer)
    state = Column(String)
    saleCategory = Column(String)
    saleDate = Column(String)
    







