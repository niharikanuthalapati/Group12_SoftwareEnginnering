import pandas as pd
# from transformers import pipeline
from textblob import TextBlob

class DataAnalyzer:
    # def __init__(self):
    #     self.sentiment_analyzer = pipeline('sentiment-analysis')

    def read_data(self, file_path):
        if file_path.endswith('.xlsx'):
            return pd.read_excel(file_path)
        elif file_path.endswith('.csv'):
            return pd.read_csv(file_path)
        raise ValueError("Unsupported file format")

    # def analyze_sentiment(self, text):
    #     analysis = self.sentiment_analyzer(text)[0]
    #     label, score = analysis['label'], analysis['score']
    #     if label == 'POSITIVE' and score > 0.55:
    #         return 'positive'
    #     elif label == 'NEGATIVE' and score > 0.55:
    #         return 'negative'
    #     return 'neutral'
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

    def analyze(self, file_path):
        df = self.read_data(file_path)
        analyzed_df = self.perform_analysis(df)
        info, sentiment_counts, sentiment_percentages = self.aggregate_data(analyzed_df)
        
        # Convert numpy.int64 to native Python int for JSON serialization
        total_positive = int(sentiment_counts.get('positive', 0))
        total_neutral = int(sentiment_counts.get('neutral', 0))
        total_negative = int(sentiment_counts.get('negative', 0))
        percent_positive = float(sentiment_percentages.get('positive', 0.0))
        percent_neutral = float(sentiment_percentages.get('neutral', 0.0))
        percent_negative = float(sentiment_percentages.get('negative', 0.0))

        # Constructing the sentiment_summary
        sentiment_summary = {
            'labels': ['Positive', 'Neutral', 'Negative'],
            'datasets': [{
                'data': [total_positive, total_neutral, total_negative],
                'percentages': [percent_positive, percent_neutral, percent_negative],
            }]
        }

        return {
            'review_text': info['description'],
            'sentiment_summary': sentiment_summary
        }