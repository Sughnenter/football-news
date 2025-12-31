import requests
from django.conf import settings

BASE_URL = "https://newsapi.org/v2/everything"
NEWSAPI_KEY = settings.NEWS_API_KEY,
def fetch_football_news(query):
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 20,
        "apiKey": NEWSAPI_KEY,
        "sources": "bbc-sport,espn,sky-sports,sportingnews"  # optional, soccer-only sources
    }
    headers = {"Authorization": f"Bearer {NEWSAPI_KEY}"}

    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()
