from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from datetime import datetime


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    email: EmailStr = Field(unique=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)