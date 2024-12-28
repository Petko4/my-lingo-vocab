from fastapi import APIRouter, Depends

from app.dependencies import require_auth


router = APIRouter(
    prefix="/vocabulary",
    responses={404: {"description": "Not found"}},
    tags=["vocabulary"],
    dependencies=[Depends(require_auth)]
)


@ router.post("/")
async def create_vocabulary():
    return {"message": "Protected route"}
