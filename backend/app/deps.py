from typing import Annotated
from fastapi import HTTPException, status, Cookie, Depends
from pydantic import EmailStr
from sqlmodel import Session, select
from app.db import SessionDep
from app.security import SECRET_KEY, ALGORITHM, password_hash, DUMMY_HASH
from app.models import User, UserCreate
import jwt
from jwt.exceptions import InvalidTokenError
import uuid

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
      user_id = uuid.UUID(payload.get("sub"))
    except (InvalidTokenError, TypeError, ValueError):
      raise credential_exception
    user = session.get(User, user_id)
    if not user:
        raise credential_exception
    return user

CurrentUserDep = Annotated[User, Depends(get_current_user)]