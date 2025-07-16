from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fruit dictionary
fruit_list: Dict[str, str] = {
    "1": "Apple",
    "2": "Banana",
    "3": "Cherry",
    "4": "Date",
    "5": "Elderberry"
}

# GET: fetch all fruits
@app.get("/getlist")
def get_list():
    return fruit_list

# POST: add a new fruit
@app.post("/postlist")
async def post_fruit(request: Request):
    item = await request.json()
    if "item" not in item:
        return {"error": "Missing 'item' in request body"}

    new_id = str(len(fruit_list) + 1)
    fruit_list[new_id] = item["item"]
    return fruit_list

