from fastapi import FastAPI, status, HTTPException, Depends, Response, Cookie
from contextlib import asynccontextmanager
from .db import create_db_and_tables, SessionDep
from .models import UserPublic, UserCreate, User, UserLogin
from .security import password_hash, DUMMY_HASH, create_access_token, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import EmailStr
from sqlmodel import Session, select
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

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

def get_current_user(
        session: SessionDep, 
        access_token: Annotated[str | None, Cookie()] = None
    ):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )

    if not access_token:
        raise credential_exception
    
    try:
      payload = jwt.decode(jwt=access_token, key=SECRET_KEY, algorithms=[ALGORITHM])
      user_id = int(payload.get("sub"))
      if not user_id:
        raise credential_exception
    except (InvalidTokenError, TypeError, ValueError):
      raise credential_exception
    user = session.get(User, user_id)
    if not user:
        raise credential_exception
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

@app.post("/auth/login", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def login_user(
    session: SessionDep,
    response: Response, 
    data: UserLogin,
):
    user = authenticate_user(session, 
                             email=data.email, 
                             password=data.password
                             )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect email or password"
                            )
    
    access_token = create_access_token(user.id)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * ACCESS_TOKEN_EXPIRE_MINUTES,
    )

    return user

@app.get("/auth/me", response_model=UserPublic)
async def get_user(user: Annotated[User, Depends(get_current_user)]):
    return user

@app.post("/auth/logout")
async def logout_user(response: Response):
    response.delete_cookie("access_token")
    return {"message": "logout"}