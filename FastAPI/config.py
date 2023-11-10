from pydantic_settings import BaseSettings


# define the settings class
class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    gmaps_api_key: str

    # import variables from .env file
    class Config:
        env_file = ".env"


# create an instance of the settings class
settings = Settings()
