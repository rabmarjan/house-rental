
from .auth import router as auth_router
from .users import router as users_router
from .agents import router as agents_router
from .review import router as reviews_router
from .houses import router as houses_router
from .furniture_requests import router as furniture_requests_router
from .dashboard import router as dashboard_router
from .agent_stats import router as agent_stats_router

__all__ = [
    "auth_router", "users_router", "agents_router", "agent_stats_router", "reviews_router", "houses_router", "furniture_requests_router", "dashboard_router"
]

