from newsapi import NewsApiClient
import os

# Initialize NewsAPI client with the API key from environment variables
newsapi = NewsApiClient(api_key=os.getenv('NEWS_API_KEY'))

def fetch_news_by_interest(user_interests, max_articles=20):
    """
    Fetch news articles based on user interests using NewsAPI.
    """
    all_articles = []
    for interest in user_interests:
        # Query NewsAPI for relevant articles based on the user's interests
        news_response = newsapi.get_top_headlines(category=interest.lower(), language='en', page_size=max_articles)
        
        if news_response and news_response.get('articles'):
            all_articles.extend(news_response['articles'])
    
    # Return only unique articles based on title
    unique_articles = {article['title']: article for article in all_articles}.values()
    return list(unique_articles)
