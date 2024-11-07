from openai import OpenAI
from fastapi import FastAPI

openai_client = OpenAI()

app = FastAPI()

@app.get("/chat_completion")
async def chat_completion(prompt: str, model: str):
    return openai_client.chat_completion(prompt, model)

