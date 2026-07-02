from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from .db import create_db_and_tables, SessionDep
from .models import UserPublic, UserCreate, User, Token
from .security import password_hash, DUMMY_HASH, create_access_token
from pydantic import EmailStr
from sqlmodel import Session, select
from typing import Annotated

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

def verify_password(password, hashed_password):
    return password_hash.verify(password=password, hash=hashed_password)

def get_hashed_password(password):
    hashed_password = password_hash.hash(password)
    return hashed_password

def check_username_exist(session: Session, username: str):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        return False
    return True

def check_email_exist(session: Session, email: EmailStr):
    statement = select(User).where(User.email == email)
    email_adress = session.exec(statement).first()
    if not email_adress:
        return False
    return True

def create_new_user(session: Session, user: UserCreate):
    hashed_password = get_hashed_password(user.password)
    new_user = User(
        username=user.username, 
        email=user.email, 
        password_hash=hashed_password,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

def authenticate_user(session: Session, email: str, password:str):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user



@app.post("/auth/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(session: SessionDep, user: UserCreate):
    if check_email_exist(session, user.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Email Adress is taken"
        )
    if check_username_exist(session, user.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is taken"
        )
    return create_new_user(session, user)

@app.post("/auth/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login_user(
    session: SessionDep, 
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(session, 
                             email=form_data.username, 
                             password=form_data.password
                             )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect email or password"
                            )
    access_token = create_access_token(user.id)
    return Token(access_token=access_token, token_type="bearer")