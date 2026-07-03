from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from datetime import datetime


class UserBase(SQLModel):
    username: str = Field(unique=True)
    email: EmailStr = Field(unique=True)

class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)

class UserCreate(UserBase):
    password: str

class UserLogin(SQLModel):
    email: EmailStr
    password: str

class UserPublic(UserBase):
    id: int
    created_at: datetime

