from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    #Application settings
    APP_NAME: str = "AI for enterprise cost intelligence"
    APP_VERSION: str = "0.1.0"
    DEBUG:bool=True
    ENVIRONMENT:str="development"

    #API settings
    API_V1_PREFIX:str = "/api/v1"

    #Openai settings
    OPENAI_API_KEY:str = ""
    OPENAI_MODEL:str="gpt-4.1-mini"

    #Database settings
    DATABASE_URL:str = ""

    #AWS settings
    AWS_ACCESS_KEY_ID:str = ""
    AWS_SECRET_ACCESS_KEY:str = ""
    AWS_REGION:str = "us-east-1"
    S3_BUCKET_NAME:str = "" 

    #Security settings
    SECRET_KEY: str = "your_secret_key" 
    ACCESS_TOKEN_EXPIRE_MINUTES: int =60

    #File upload settings
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_FILE_TYPES:str ="csv,xlsx,json"

    #Logging settings
    LOG_LEVEL:str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True)

settings=Settings()