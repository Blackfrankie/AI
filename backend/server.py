from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="OmniAI Studio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums for AI modules
class AIModuleType(str, Enum):
    WEBSITE = "website"
    GAME = "game"
    CONTENT = "content"
    IMAGE = "image"
    CODE = "code"
    DATA = "data"
    CREATIVE = "creative"

class GenerationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# Models
class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_token: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    generations_count: int = 0

class AIRequest(BaseModel):
    module_type: AIModuleType
    prompt: str
    parameters: Dict[str, Any] = {}
    session_id: Optional[str] = None

class AIGeneration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: Optional[str] = None
    module_type: AIModuleType
    prompt: str
    parameters: Dict[str, Any]
    status: GenerationStatus = GenerationStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    processing_time: Optional[float] = None

class UserHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    generations: List[str] = []  # List of generation IDs
    total_generations: int = 0
    favorite_module: Optional[AIModuleType] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Request/Response Models
class CreateSessionRequest(BaseModel):
    user_agent: Optional[str] = None

class WebsiteGenerationRequest(BaseModel):
    description: str
    website_type: Optional[str] = None
    session_id: Optional[str] = None

class GameGenerationRequest(BaseModel):
    game_idea: str
    game_type: Optional[str] = None
    platform: str = "web"
    session_id: Optional[str] = None

class ContentGenerationRequest(BaseModel):
    topic: str
    content_type: str
    tone: str = "professional"
    length: str = "medium"
    session_id: Optional[str] = None

class ImageGenerationRequest(BaseModel):
    prompt: str
    style: str = "realistic"
    size: str = "1024x1024"
    quality: str = "high"
    session_id: Optional[str] = None

class CodeGenerationRequest(BaseModel):
    request: str
    language: str = "javascript"
    task_type: Optional[str] = None
    session_id: Optional[str] = None

class DataAnalysisRequest(BaseModel):
    data_input: str
    analysis_type: str
    data_source: str = "text"
    session_id: Optional[str] = None

class CreativeRequest(BaseModel):
    prompt: str
    creative_type: str
    style: str = "modern"
    mood: Optional[str] = None
    session_id: Optional[str] = None

# Mock AI responses (will be replaced with real AI when API keys are provided)
from data.mock_ai_responses import (
    generate_mock_website,
    generate_mock_game,
    generate_mock_content,
    generate_mock_images,
    generate_mock_code,
    generate_mock_data_analysis,
    generate_mock_creative_content
)

# Session Management
@api_router.post("/sessions", response_model=UserSession)
async def create_session(request: CreateSessionRequest):
    session_token = str(uuid.uuid4())
    session = UserSession(session_token=session_token)
    
    await db.user_sessions.insert_one(session.dict())
    return session

@api_router.get("/sessions/{session_id}", response_model=UserSession)
async def get_session(session_id: str):
    session = await db.user_sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return UserSession(**session)

# AI Generation Endpoints
@api_router.post("/ai/website", response_model=AIGeneration)
async def generate_website(request: WebsiteGenerationRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.WEBSITE,
        prompt=request.description,
        parameters={
            "website_type": request.website_type
        }
    )
    
    # Store in database
    await db.ai_generations.insert_one(generation.dict())
    
    # Generate mock response (replace with real AI later)
    mock_result = generate_mock_website(request.description, request.website_type)
    
    # Update generation with result
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 2.5
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    # Update session statistics
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

@api_router.post("/ai/game", response_model=AIGeneration)
async def generate_game(request: GameGenerationRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.GAME,
        prompt=request.game_idea,
        parameters={
            "game_type": request.game_type,
            "platform": request.platform
        }
    )
    
    await db.ai_generations.insert_one(generation.dict())
    
    mock_result = generate_mock_game(request.game_idea, request.game_type, request.platform)
    
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 3.2
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

@api_router.post("/ai/content", response_model=AIGeneration)
async def generate_content(request: ContentGenerationRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.CONTENT,
        prompt=request.topic,
        parameters={
            "content_type": request.content_type,
            "tone": request.tone,
            "length": request.length
        }
    )
    
    await db.ai_generations.insert_one(generation.dict())
    
    mock_result = generate_mock_content(request.topic, request.content_type, request.tone, request.length)
    
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 2.1
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

@api_router.post("/ai/image", response_model=AIGeneration)
async def generate_image(request: ImageGenerationRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.IMAGE,
        prompt=request.prompt,
        parameters={
            "style": request.style,
            "size": request.size,
            "quality": request.quality
        }
    )
    
    await db.ai_generations.insert_one(generation.dict())
    
    mock_result = generate_mock_images(request.prompt, request.style, request.size, request.quality)
    
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 4.1
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

@api_router.post("/ai/code", response_model=AIGeneration)
async def generate_code(request: CodeGenerationRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.CODE,
        prompt=request.request,
        parameters={
            "language": request.language,
            "task_type": request.task_type
        }
    )
    
    await db.ai_generations.insert_one(generation.dict())
    
    mock_result = generate_mock_code(request.request, request.language, request.task_type)
    
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 2.8
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

@api_router.post("/ai/data", response_model=AIGeneration)
async def analyze_data(request: DataAnalysisRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.DATA,
        prompt=request.data_input,
        parameters={
            "analysis_type": request.analysis_type,
            "data_source": request.data_source
        }
    )
    
    await db.ai_generations.insert_one(generation.dict())
    
    mock_result = generate_mock_data_analysis(request.data_input, request.analysis_type, request.data_source)
    
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 3.5
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

@api_router.post("/ai/creative", response_model=AIGeneration)
async def generate_creative(request: CreativeRequest):
    generation = AIGeneration(
        session_id=request.session_id,
        module_type=AIModuleType.CREATIVE,
        prompt=request.prompt,
        parameters={
            "creative_type": request.creative_type,
            "style": request.style,
            "mood": request.mood
        }
    )
    
    await db.ai_generations.insert_one(generation.dict())
    
    mock_result = generate_mock_creative_content(request.prompt, request.creative_type, request.style, request.mood)
    
    generation.status = GenerationStatus.COMPLETED
    generation.result = mock_result
    generation.completed_at = datetime.utcnow()
    generation.processing_time = 2.9
    
    await db.ai_generations.update_one(
        {"id": generation.id}, 
        {"$set": generation.dict()}
    )
    
    if request.session_id:
        await db.user_sessions.update_one(
            {"id": request.session_id},
            {
                "$inc": {"generations_count": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    
    return generation

# History and Analytics
@api_router.get("/history/{session_id}")
async def get_user_history(session_id: str, limit: int = 50):
    generations = await db.ai_generations.find(
        {"session_id": session_id}
    ).sort("created_at", -1).limit(limit).to_list(length=limit)
    
    return {"generations": generations, "total": len(generations)}

@api_router.get("/generations/{generation_id}", response_model=AIGeneration)
async def get_generation(generation_id: str):
    generation = await db.ai_generations.find_one({"id": generation_id})
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    return AIGeneration(**generation)

@api_router.get("/stats/platform")
async def get_platform_stats():
    # Get total generations by module
    pipeline = [
        {"$group": {
            "_id": "$module_type",
            "count": {"$sum": 1}
        }}
    ]
    
    module_stats = await db.ai_generations.aggregate(pipeline).to_list(None)
    
    # Get total users (sessions)
    total_sessions = await db.user_sessions.count_documents({})
    
    # Get total generations
    total_generations = await db.ai_generations.count_documents({})
    
    return {
        "total_sessions": total_sessions,
        "total_generations": total_generations,
        "module_stats": module_stats,
        "platform_status": "operational"
    }

# Health check
@api_router.get("/")
async def root():
    return {"message": "OmniAI Studio API is running", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()