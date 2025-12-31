import requests
from django.conf import settings

BASE_URL = "https://newsapi.org/v2/everything"

def fetch_football_news(query):
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 20,
        "apiKey": settings.NEWS_API_KEY,
    }

    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()
