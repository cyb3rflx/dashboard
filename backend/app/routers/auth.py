from fastapi import APIRouter
from app.db import SessionDep
from app.models import UserCreate, UserLogin, UserPublic
from fastapi import HTTPException, status, Response
from app.deps import CurrentUserDep, check_email_exist, check_username_exist, create_new_user, authenticate_user
from app.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
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

@router.post("/login", response_model=UserPublic, status_code=status.HTTP_200_OK)
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

@router.get("/me", response_model=UserPublic)
async def get_user(user: CurrentUserDep):
    return user

@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("access_token")
    return {"message": "logout"}