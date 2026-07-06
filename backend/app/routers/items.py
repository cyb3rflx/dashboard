from fastapi import APIRouter, status, HTTPException
from sqlmodel import select
from app.models import ItemPublic, ItemCreate, Item, ItemUpdate
from app.db import SessionDep
from app.deps import CurrentUserDep
from datetime import datetime

router = APIRouter(prefix="/items", tags=["items"])

@router.post("", response_model=ItemPublic, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate, session: SessionDep, current_user: CurrentUserDep):
    db_item = Item.model_validate(item, update={"owner_id": current_user.id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

@router.get("", response_model=list[ItemPublic], status_code=status.HTTP_200_OK)
async def read_items(session: SessionDep, current_user: CurrentUserDep):
    statement = select(Item).where(Item.owner_id == current_user.id)
    items = session.exec(statement).all()
    return items

@router.get("/{item_id}", response_model=ItemPublic)
async def read_item(session: SessionDep, item_id: int, current_user: CurrentUserDep):
    item = session.get(Item, item_id)
    if not item or item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return item

@router.put("/{item_id}", response_model=ItemPublic)
async def update_item(session: SessionDep, item_id: int, current_user: CurrentUserDep, data: ItemUpdate):
    item = session.get(Item, item_id)
    if not item or item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    item.sqlmodel_update(data.model_dump(exclude_unset=True))
    item.updated_at = datetime.now()
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(session: SessionDep, item_id: int, current_user: CurrentUserDep):
    item = session.get(Item, item_id)
    if not item or item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    session.delete(item)
    session.commit()