import pandas as pd
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

class DataAnalyzer:

    def read_data(self, file_path):
        if file_path.endswith('.xlsx'):
            return pd.read_excel(file_path)
        elif file_path.endswith('.csv'):
            return pd.read_csv(file_path)
        raise ValueError("Unsupported file format")

    def analyze_sentiment(self, text):
        analysis = TextBlob(text)
        if analysis.sentiment.polarity > 0:
            return 'positive'
        elif analysis.sentiment.polarity < 0:
            return 'negative'
        else:
            return 'neutral'
        
    def perform_analysis(self, df):
        concat_text = df['review_headline'].astype(str) + ' ' + df['review_body'].astype(str)
        df['review_sentiment'] = concat_text.apply(self.analyze_sentiment)
        return df

    def aggregate_data(self, df):
        sentiment_counts = df['review_sentiment'].value_counts()
        sentiment_percentages = sentiment_counts / len(df) * 100
        description = self.generate_description(df, sentiment_counts, sentiment_percentages)
        info = {'total_rows': len(df), **sentiment_counts.to_dict(), **sentiment_percentages.to_dict(), 'description': description}
        return info, sentiment_counts, sentiment_percentages

    def generate_description(self, df, counts, percentages):
        # Prefixing percentage keys
        percentages_prefixed = {'percent_' + k: v for k, v in percentages.items()}

        template = (
            "This sentiment analysis report provides insights into customer opinions. "
            "The dataset contains {total} reviews: {positive} positive, {negative} negative, "
            "and {neutral} neutral. This reflects a sentiment distribution of "
            "{percent_positive:.2f}% positive, {percent_negative:.2f}% negative, "
            "and {percent_neutral:.2f}% neutral."
        )
        return template.format(total=len(df), **counts, **percentages_prefixed)

    def vectorize_text(self, df, max_features=1000):
        vectorizer = TfidfVectorizer(max_features=max_features)
        tfidf_matrix = vectorizer.fit_transform(df['concatenated_text'])
        return tfidf_matrix, vectorizer.get_feature_names_out()

    def cluster_reviews(self, tfidf_matrix, num_clusters=5):
        km = KMeans(n_clusters=num_clusters)
        km.fit(tfidf_matrix)
        clusters = km.labels_
        return clusters

    def analyze(self, file_path):
        df = self.read_data(file_path)
        
        # Performing sentiment analysis
        analyzed_df = self.perform_analysis(df)
        info, sentiment_counts, sentiment_percentages = self.aggregate_data(analyzed_df)
        
        # Preparing text for clustering
        analyzed_df['concatenated_text'] = analyzed_df['review_headline'].astype(str) + ' ' + analyzed_df['review_body'].astype(str)
        
        # Vectorizing and clustering
        tfidf_matrix, feature_names = self.vectorize_text(analyzed_df)
        cluster_labels = self.cluster_reviews(tfidf_matrix)
        analyzed_df['cluster'] = cluster_labels
        
        # Grouping reviews by cluster and getting sample texts
        cluster_samples = analyzed_df.groupby('cluster')['concatenated_text'].apply(lambda texts: texts.tolist()[:10]).to_dict()

        # Summarizing sentiment analysis
        sentiment_summary = {
            'labels': ['Positive', 'Neutral', 'Negative'],
            'datasets': [{
                'data': [int(sentiment_counts.get('positive', 0)),
                         int(sentiment_counts.get('neutral', 0)),
                         int(sentiment_counts.get('negative', 0))],
                'percentages': [float(sentiment_percentages.get('positive', 0.0)),
                                float(sentiment_percentages.get('neutral', 0.0)),
                                float(sentiment_percentages.get('negative', 0.0))],
            }]
        }

        # Constructing the final result
        result = {
            'review_text': info['description'],
            'sentiment_summary': sentiment_summary,
            'cluster_samples': cluster_samples
        }

        return result