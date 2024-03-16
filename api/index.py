from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

origins = [
  "https://test-iurkozn3t-greenbauer.vercel.app",
  "http://localhost",
  "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/data", response_class=JSONResponse)
async def get_data(page: int = 1, limit: int = 10):
  data = json.load(open("mocks/data.json"))
  for i, post in enumerate(data):
    post["post_id"] = i

  start = (page - 1) * limit
  end = start + limit

  paginated_data = data[start:end]
  return paginated_data


@app.patch("/api/data/{id}", response_class=JSONResponse)
async def patch_data(id: int, body: dict):
  data = json.load(open("mocks/data.json"))
  data[id] = jsonable_encoder({**data[id], **body})

  with open("mocks/data.json", "w") as file:
    json.dump(data, file, indent=2)

  return data[id]