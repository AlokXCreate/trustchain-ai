from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.models.enums import UserRole
from app.schemas.schemas import TokenData

import bcrypt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return plain_password == hashed_password


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


# In-memory store for demo users and sessions
DEMO_USERS_DB: Dict[str, Dict[str, Any]] = {
    "individual@trustchain.ai": {
        "id": "usr_indiv_01",
        "email": "individual@trustchain.ai",
        "hashed_password": get_password_hash("Password123!"),
        "full_name": "Alex Mercer",
        "role": UserRole.INDIVIDUAL,
        "organization_name": "Stanford Alumni",
        "organization_type": "Individual",
        "designation": "Graduate Engineer",
        "country": "United States",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow() - timedelta(days=60),
        "updated_at": datetime.utcnow()
    },
    "institution@trustchain.ai": {
        "id": "usr_inst_01",
        "email": "institution@trustchain.ai",
        "hashed_password": get_password_hash("Password123!"),
        "full_name": "Dr. Eleanor Vance",
        "role": UserRole.INSTITUTION,
        "organization_name": "MIT Registrar & Credentialing Office",
        "organization_type": "University",
        "designation": "Chief Registrar",
        "country": "United States",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow() - timedelta(days=120),
        "updated_at": datetime.utcnow()
    },
    "verifier@trustchain.ai": {
        "id": "usr_verif_01",
        "email": "verifier@trustchain.ai",
        "hashed_password": get_password_hash("Password123!"),
        "full_name": "Marcus Chen",
        "role": UserRole.VERIFIER,
        "organization_name": "Apex Global Talent & Recruiting",
        "organization_type": "Corporate HR",
        "designation": "Head of Technical Recruiting",
        "country": "Singapore",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow() - timedelta(days=45),
        "updated_at": datetime.utcnow()
    },
    "admin@trustchain.ai": {
        "id": "usr_admin_01",
        "email": "admin@trustchain.ai",
        "hashed_password": get_password_hash("Password123!"),
        "full_name": "Sarah Connor",
        "role": UserRole.ADMIN,
        "organization_name": "TrustChain Platform Operations",
        "organization_type": "RegTech Provider",
        "designation": "Platform Administrator",
        "country": "Switzerland",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow() - timedelta(days=180),
        "updated_at": datetime.utcnow()
    }
}


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # If no token provided in demo mode, return default individual demo user for seamless UX
    if not token:
        if settings.DEMO_MODE:
            return DEMO_USERS_DB["individual@trustchain.ai"]
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        if user_id is None or email is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id, role=payload.get("role"))
    except JWTError:
        raise credentials_exception
        
    user = DEMO_USERS_DB.get(email)
    if user is None:
        # Search by id
        for u in DEMO_USERS_DB.values():
            if u["id"] == user_id:
                user = u
                break
                
    if user is None or not user.get("is_active", True):
        raise credentials_exception
        
    return user


def require_role(allowed_roles: List[Any]):
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = current_user.get("role")
        user_role_str = user_role.value if hasattr(user_role, "value") else str(user_role)
        allowed_strs = [r.value if hasattr(r, "value") else str(r) for r in allowed_roles]

        if user_role_str not in allowed_strs and user_role_str != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {allowed_strs}, user has: {user_role_str}"
            )
        return current_user
    return role_checker
