from django.shortcuts import render

from django.http import JsonResponse
from django.core.cache import cache
from .services import fetch_football_news
from .constants import LEAGUE_KEYWORDS

def football_news(request):
    league = request.GET.get("league", "general").lower()
    query = LEAGUE_KEYWORDS.get(league, LEAGUE_KEYWORDS["general"])
    cache_key = f"football_news_{league}"

    cached = cache.get(cache_key)
    if cached:
        return JsonResponse(cached)

    raw_data = fetch_football_news(query=query)

    articles = []
    for article in raw_data.get("articles", []):
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

    cache.set(cache_key, response, 60 * 30)
    return JsonResponse(response)


