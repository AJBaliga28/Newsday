import sys
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
from dotenv import load_dotenv
from newsapi import NewsApiClient

# Load environment variables from .env file
load_dotenv()

# Initialize MongoDB client
MONGO_URL = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URL, server_api=ServerApi('1'))

# Access the database and collections
db = client['newsday']
saved_items_collection = db['saveditems']
users_collection = db['users']

# Initialize NewsAPI client with the API key from the .env file
NEWSAPI_KEY = os.getenv('NEWS_API_KEY')
newsapi = NewsApiClient(api_key=NEWSAPI_KEY)

# Test MongoDB connection
try:
    client.admin.command('ping')
    # print("Pinged your deployment. You successfully connected to MongoDB!", file=sys.stderr)
except Exception as e:
    print(e, file=sys.stderr)

# Fetch saved articles for a user
def get_saved_articles(user_id):
    try:
        user_object_id = ObjectId(user_id)
    except Exception as e:
        print(f"Invalid user ID format: {user_id}", file=sys.stderr)
        return []

    saved_items = list(saved_items_collection.find({"userId": user_object_id}))

    if not saved_items:
        print(f"No saved articles found for user with ID: {user_id}", file=sys.stderr)
        return []

    return [{"title": item['article']['title'], "description": item['article'].get('description', '')} for item in saved_items]

# Fetch user interests
def get_user_interests(user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user and 'interests' in user:
            return user['interests']
        else:
            print(f"No interests found for user {user_id}.", file=sys.stderr)
            return []
    except Exception as e:
        print(f"Error fetching user interests: {str(e)}", file=sys.stderr)
        return []

# Fetch news articles from NewsAPI based on user interests
def fetch_news_by_interest(user_interests, max_articles=20):
    all_articles = []
    for interest in user_interests:
        interest = interest.lower()
        try:
            # print(f"Fetching news for interest: {interest}", file=sys.stderr)
            # Use 'q' instead of 'category' to search by keyword
            news_response = newsapi.get_everything(q=interest, language='en', page_size=max_articles)
            # print(f"NewsAPI response for {interest}: {news_response}", file=sys.stderr)
            
            if news_response and news_response.get('articles'):
                all_articles.extend(news_response['articles'])
        except Exception as e:
            print(f"Error fetching news for interest {interest}: {str(e)}", file=sys.stderr)

    unique_articles = {article['title']: article for article in all_articles}.values()
    return list(unique_articles)


# Calculate similarity between saved and fresh articles
def calculate_article_similarity(saved_articles, fresh_articles):
    if not saved_articles:
        return fresh_articles

    saved_article_texts = [article['title'] + " " + article['description'] for article in saved_articles]
    fresh_article_texts = [article['title'] + " " + str(article.get('description', '')) for article in fresh_articles]

    all_article_texts = saved_article_texts + fresh_article_texts

    vectorizer = TfidfVectorizer(stop_words='english')
    article_vectors = vectorizer.fit_transform(all_article_texts)

    saved_article_vectors = article_vectors[:len(saved_article_texts)]
    fresh_article_vectors = article_vectors[len(saved_article_texts):]

    similarity_matrix = cosine_similarity(saved_article_vectors, fresh_article_vectors)
    article_scores = similarity_matrix.max(axis=0)

    recommended_articles = sorted(zip(fresh_articles, article_scores), key=lambda x: x[1], reverse=True)
    return recommended_articles

# Generate recommendations for a user
# Generate recommendations for a user
def get_recommendations(user_id):
    current_user_interests = get_user_interests(user_id)
    # print(f"User interests: {current_user_interests}", file=sys.stderr)
    
    # Fetch saved articles
    saved_articles = get_saved_articles(user_id)
    # print(f"Saved articles: {len(saved_articles)}", file=sys.stderr)
    
     # Fetch fresh articles from NewsAPI based on interests
    fresh_articles = fetch_news_by_interest(current_user_interests, max_articles=50)
    # print(f"Fresh articles: {len(fresh_articles)}", file=sys.stderr)
    
    # If no fresh articles, return empty list
    if not fresh_articles:
        print("No fresh articles found, returning empty recommendations")
        return []
    
    # If no saved articles exist, return fresh articles as recommendations
    if not saved_articles:
        print("No saved articles, returning fresh articles", file=sys.stderr)
        return fresh_articles
    
    # If no fresh articles are available, we can't calculate similarity
    if not fresh_articles:
        print("No fresh articles found", file=sys.stderr)
        return []
    
    # Calculate article similarity
    try:
        recommended_articles = calculate_article_similarity(saved_articles, fresh_articles)
        top_recommendations = [article for article, score in recommended_articles[:10]]
        return top_recommendations
    except Exception as e:
        print(f"Error during similarity calculation: {str(e)}", file=sys.stderr)
        return []

# Main function
if __name__ == "__main__":
    # Example: Add detailed error logging
    try:
        user_id = sys.argv[1]
        # print(f"User ID received: {user_id}", file=sys.stderr)
        
        recommendations = get_recommendations(user_id)
        
        # print(f"Generated Recommendations: {recommendations[0] if recommendations else 'No recommendations found'}", file=sys.stderr)
        
        if recommendations:
            # Output the list of article titles
            titles = [article['title'] for article in recommendations]
            print(json.dumps(titles))  # Output only titles as JSON
        else:
            print(json.dumps([]))  # Output an empty list if no recommendations
    except Exception as e:
        print(f"Error during recommendation generation: {str(e)}", file=sys.stderr)
        sys.exit(1)  # Make sure to exit with a non-zero status code on failure
