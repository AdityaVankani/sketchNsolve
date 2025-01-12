from dotenv import load_dotenv
import os

SERVER_URL='localhost'
PORT='3000'
ENV='dev'

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
