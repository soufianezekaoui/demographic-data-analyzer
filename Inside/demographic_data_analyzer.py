import pandas as pd


def calculate_demographic_data(print_data=True):
    # Read data from file
    df = pd.read_csv("data/adult.data.csv")

    # ===================================================================
    # HINT 1: How many of each race are represented in this dataset?
    race_count = df['race'].value_counts()

    # ===================================================================
    # HINT 2: What is the average age of men?
    average_age_men = round(df[df['sex']=='Male']['age'].mean(), 1)

    # ===================================================================
    # HINT 3: What is the percentage of people who have a Bachelor's degree?
    percentage_bachelors = round((len(df[df['education'] == 'Bachelors']) / len(df)) * 100, 1)

    # ===================================================================
    # HINT 4 & 5: Education and salary percentages
    
    # With Advanced Education (Bachelors, Masters, or Doctorate)
    higher_education = df[df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])]
    higer_edu_rich = len(higher_education[higher_education['salary'] == '>50K'])
    
    # Without Advanced Education
    lower_education = df[~df['education'].isin(['Bachelors', 'Masters', 'Doctorate'])]
    lower_edu_rich = len(lower_education[lower_education['salary'] == '>50K'])
    
    # Percentage with salary >50K
    higher_education_rich = round((higer_edu_rich / len(higher_education) * 100), 1)
    lower_education_rich = round((lower_edu_rich / len(lower_education) * 100), 1)

    # ===================================================================
    # HINT 6: What is the minimum number of hours a person works per week?
    min_work_hours = df['hours-per-week'].min()

    # ===================================================================
    # HINT 7: What percentage of people who work minimum hours earn >50K?
    min_workers = df[df['hours-per-week'] == min_work_hours]
    num_min_workers = len(min_workers['salary'] == '>50K')
    
    rich_percentage = round((num_min_workers / len(min_workers)) * 100, 1)

    # ===================================================================
    # HINT 8: What country has the highest percentage earning >50K?
    country_stats = df.groupby('native-country')['salary'].apply(
        lambda x: (x == '>50K').sum() / len(x) * 100
        )

    highest_earning_country = country_stats.idxmax()
    highest_earning_country_percentage = round(country_stats.max(), 1)

    # ===================================================================
    # HINT 9: Most popular occupation for those earning >50K in India

    # Filter for India + rich people
    india_rich = df[(df['native-country'] == 'India') & (df['salary'] == '>50K')]

    top_IN_occupation = india_rich['occupation'].value_counts().idxmax()
    
    
    if print_data:
        print("Number of each race:\n", race_count) 
        print("Average age of men:", average_age_men)
        print(f"Percentage with Bachelors degrees: {percentage_bachelors}%")
        print(f"Percentage with higher education that earn >50K: {higher_education_rich}%")
        print(f"Percentage without higher education that earn >50K: {lower_education_rich}%")
        print(f"Min work time: {min_work_hours} hours/week")
        print(f"Percentage of rich among those who work fewest hours: {rich_percentage}%")
        print("Country with highest percentage of rich:", highest_earning_country)
        print(f"Highest percentage of rich people in country: {highest_earning_country_percentage}%")
        print("Top occupations in India:", top_IN_occupation)

    return {
        'race_count': race_count,
        'average_age_men': average_age_men,
        'percentage_bachelors': percentage_bachelors,
        'higher_education_rich': higher_education_rich,
        'lower_education_rich': lower_education_rich,
        'min_work_hours': min_work_hours,
        'rich_percentage': rich_percentage,
        'highest_earning_country': highest_earning_country,
        'highest_earning_country_percentage':
        highest_earning_country_percentage,
        'top_IN_occupation': top_IN_occupation
    }

