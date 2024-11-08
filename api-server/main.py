import sys
from openai import OpenAI
from fastapi import FastAPI

from fastapi import Request
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import logging


async def unhandled_exception_handler(request: Request, exc: Exception) -> PlainTextResponse:
    """
    This middleware will log all unhandled exceptions.
    Unhandled exceptions are all exceptions that are not HTTPExceptions or RequestValidationErrors.
    """
    logging.debug("Unhandled exception was triggered when processing the request %s", request.url.path)

    # gather the request information
    host = getattr(getattr(request, "client", None), "host", None)
    port = getattr(getattr(request, "client", None), "port", None)
    url = f"{request.url.path}?{request.query_params}" if request.query_params else request.url.path
    exception_type, exception_value, exception_traceback = sys.exc_info()
    exception_name = getattr(exception_type, "__name__", None)

    # save the log
    logging.error(
        f'{host}:{port} - "{request.method} {url}" 500 Internal Server Error <{exception_name}: {exception_value}>'
    )

    return PlainTextResponse(str(exc), status_code=500)


openai_client = OpenAI()

app = FastAPI()


origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, unhandled_exception_handler)



@app.get("/chat_completion")
async def chat_completion(prompt: str, model: str):
    return openai_client.chat_completion(prompt, model)


@app.get("/")
async def root():
    return {"message": "Waffle fries are the best!"}