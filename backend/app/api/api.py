from fastapi import APIRouter
from app.api.routes import auth, users, roles, companies, questions, attempts

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(attempts.router, prefix="/attempts", tags=["attempts"])
