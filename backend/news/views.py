from django.shortcuts import render
import requests
import os
from django.http import JsonResponse
from django.core.cache import cache
from .services import fetch_football_news
from .constants import LEAGUE_KEYWORDS

def football_news(request):
    league = request.GET.get("league", "epl").lower()
    query = LEAGUE_KEYWORDS.get(league, "Premier League")  # default to EPL

    # fetch articles from NewsAPI
    raw_data = fetch_football_news(query=query)

    # filter out NFL articles (if any accidentally appear)
    articles = []
    for article in raw_data.get("articles", []):
        title_lower = (article.get("title") or "").lower()
        if "nfl" in title_lower:
            continue  # skip NFL
        articles.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "source": article.get("source", {}).get("name"),
            "url": article.get("url"),
            "image": article.get("urlToImage"),
            "published_at": article.get("publishedAt"),
        })

    response = {
        "league": league,
        "count": len(articles),
        "articles": articles,
    }

    return JsonResponse(response)