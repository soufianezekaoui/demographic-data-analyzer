"""
FLASK BACKEND - app.py
=======================

This is the "brain" of my web application. It:
1. Serves the HTML frontend to users
2. Processes data with Pandas
3. Sends JSON data to the frontend via API endpoints
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS  # Allows frontend to talk to backend
import pandas as pd
import os
from werkzeug.utils import secure_filename

# FLASK APP SETUP
# ============================================================================

# __name__ tells Flask where to find files
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
CORS(app)

# Configuration for file uploads
UPLOAD_FOLDER = 'data/uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max 16MB file size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# HELPER FUNCTIONS
# ============================================================================

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_default_data():
    try:
        df = pd.read_csv('data/adult.data.csv')
        return df
    except FileNotFoundError:
        # If file not found, return empty DataFrame with expected columns
        return pd.DataFrame()


def calculate_demographics(df):
    
    # QUESTION 1: Race distribution
    race_count = df['race'].value_counts().to_dict()
    
    # QUESTION 2: Average age of men
    average_age_men = round(df[df['sex'] == 'Male']['age'].mean(), 1)
    
    # QUESTION 3: Percentage with Bachelors
    percentage_bachelors = round(
        (len(df[df['education'] == 'Bachelors']) / len(df)) * 100, 1
    )
    
    # QUESTION 4 & 5: Advanced education vs income
    higher_education = df[df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])]
    lower_education = df[~df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])]
    
    higher_education_rich = round(
        (len(higher_education[higher_education['salary'] == '>50K']) / 
         len(higher_education)) * 100, 1
    )
    
    lower_education_rich = round(
        (len(lower_education[lower_education['salary'] == '>50K']) / 
         len(lower_education)) * 100, 1
    )
    
    # QUESTION 6: Minimum work hours
    min_work_hours = int(df['hours-per-week'].min())
    
    # QUESTION 7: Rich percentage among minimum workers
    min_workers = df[df['hours-per-week'] == min_work_hours]
    rich_percentage = round(
        (len(min_workers[min_workers['salary'] == '>50K']) / len(min_workers)) * 100, 1
    )
    
    # QUESTION 8: Country with highest rich percentage
    country_stats = df.groupby('native-country')['salary'].apply(
        lambda x: (x == '>50K').sum() / len(x) * 100
    )
    highest_earning_country = country_stats.idxmax()
    highest_earning_country_percentage = round(country_stats.max(), 1)
    
    # QUESTION 9: Top occupation in India
    india_rich = df[(df['native-country'] == 'India') & (df['salary'] == '>50K')]
    if len(india_rich) > 0:
        top_IN_occupation = india_rich['occupation'].value_counts().idxmax()
    else:
        top_IN_occupation = 'N/A'
    
    # Return all statistics as a dictionary
    return {
        'total_records': len(df),
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage': highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }


def get_education_breakdown(df):
    education_data = []
    
    for edu in df['education'].unique():
        edu_df = df[df['education'] == edu]
        rich_count = len(edu_df[edu_df['salary'] == '>50K'])
        total_count = len(edu_df)
        rich_pct = round((rich_count / total_count) * 100, 1) if total_count > 0 else 0
        
        education_data.append({
            'education': edu,
            'total': total_count,
            'rich_count': rich_count,
            'rich_percentage': rich_pct,
            'average_age': round(edu_df['age'].mean(), 1)
        })
    
    # Sort by total count descending
    education_data.sort(key=lambda x: x['total'], reverse=True)
    return education_data


def get_country_analysis(df):
    country_data = []
    
    # Get top 15 countries by population
    top_countries = df['native-country'].value_counts().head(15).index
    
    for country in top_countries:
        country_df = df[df['native-country'] == country]
        rich_count = len(country_df[country_df['salary'] == '>50K'])
        total_count = len(country_df)
        rich_pct = round((rich_count / total_count) * 100, 1)
        
        country_data.append({
            'country': country,
            'total': total_count,
            'rich_percentage': rich_pct
        })
    
    # Sort by rich percentage descending
    country_data.sort(key=lambda x: x['rich_percentage'], reverse=True)
    return country_data


def get_age_distribution(df):
    # Create age bins: 20-30, 30-40, 40-50, etc.
    age_bins = [0, 20, 30, 40, 50, 60, 70, 100]
    age_labels = ['<20', '20-30', '30-40', '40-50', '50-60', '60-70', '70+']
    
    df['age_group'] = pd.cut(df['age'], bins=age_bins, labels=age_labels, right=False)
    age_dist = df['age_group'].value_counts().sort_index().to_dict()
    
    return {k: int(v) for k, v in age_dist.items()}


# ROUTES (URL ENDPOINTS)
# ============================================================================

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/statistics')
def get_statistics():
    try:
        df = load_default_data()
        
        if df.empty:
            return jsonify({'error': 'Dataset not found'}), 404
        
        stats = calculate_demographics(df)
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/race-distribution')
def get_race_distribution():
    try:
        df = load_default_data()
        race_count = df['race'].value_counts().to_dict()
        return jsonify(race_count)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/education-breakdown')
def get_education_data():
    try:
        df = load_default_data()
        education_data = get_education_breakdown(df)
        return jsonify(education_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/country-analysis')
def get_country_data():
    try:
        df = load_default_data()
        country_data = get_country_analysis(df)
        return jsonify(country_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/age-distribution')
def get_age_data():
    try:
        df = load_default_data()
        age_data = get_age_distribution(df)
        return jsonify(age_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/upload', methods=['POST'])
def upload_file():
    
    # Check if file was included in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Check if filename is empty
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check if file is CSV
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only CSV files allowed'}), 400
    
    try:
        # Secure the filename (removes dangerous characters)
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save file
        file.save(filepath)
        
        # Load and process
        df = pd.read_csv(filepath)
        
        # Validate required columns
        required_cols = ['age', 'education', 'salary', 'sex', 'race', 
                        'native-country', 'occupation', 'hours-per-week']
        
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            return jsonify({
                'error': f'Missing required columns: {", ".join(missing_cols)}'
            }), 400
        
        # Calculate statistics
        stats = calculate_demographics(df)
        
        return jsonify({
            'success': True,
            'message': f'Successfully processed {len(df)} records',
            'stats': stats
        })
    
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500


@app.route('/api/filter', methods=['POST'])
def filter_data():
    try:
        df = load_default_data()
        
        # Get filter parameters from request
        filters = request.get_json()
        
        # Apply filters if provided
        if 'min_age' in filters:
            df = df[df['age'] >= filters['min_age']]
        
        if 'max_age' in filters:
            df = df[df['age'] <= filters['max_age']]
        
        if 'education' in filters and filters['education'] != 'all':
            df = df[df['education'] == filters['education']]
        
        if 'country' in filters and filters['country'] != 'all':
            df = df[df['native-country'] == filters['country']]
        
        if 'sex' in filters and filters['sex'] != 'all':
            df = df[df['sex'] == filters['sex']]
        
        # Calculate statistics on filtered data
        stats = calculate_demographics(df)
        
        return jsonify({
            'success': True,
            'filtered_count': len(df),
            'stats': stats
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# RUN THE APP
# ============================================================================

if __name__ == '__main__':

    print("🚀 Starting Census Vision 1994 Dashboard...")
    print("📊 Server running at: http://localhost:5000")
    print("💡 Press CTRL+C to stop")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
