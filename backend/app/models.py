from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from datetime import datetime
import uuid

class UserBase(SQLModel):
    username: str = Field(unique=True)
    email: EmailStr = Field(unique=True)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)

class UserCreate(UserBase):
    password: str

class UserLogin(SQLModel):
    email: EmailStr
    password: str

class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime


class ItemBase(SQLModel):
    title: str
    description: str | None = None

class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class ItemPublic(ItemBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class ItemCreate(ItemBase):
    pass

class ItemUpdate(SQLModel):
    title: str | None = None
    description: str | None = None




