from fastapi import APIRouter

health_router = APIRouter(
    prefix="/health",
    tags=["health/健康检查"],
    responses={404: {"description": "Not found"}}
)

@health_router.get("/")
async def health_check():
    return {"status": "healthy", "message": "GenStoryAI API is running"}

