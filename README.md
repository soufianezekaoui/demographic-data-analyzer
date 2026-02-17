# 🎯 Census Vision 1994 - Demographic Data Analyzer

A stunning, interactive web dashboard for analyzing 1994 US Census demographic data. Built with Flask, Pandas, and Chart.js with a retro-futuristic glassmorphism design.

![Census Vision 1994](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌟 Features

### Core Analytics (freeCodeCamp Project)
- ✅ Race distribution analysis
- ✅ Age demographics by gender
- ✅ Education level breakdown
- ✅ Income analysis by education
- ✅ Work hours vs salary correlation
- ✅ Geographic income distribution
- ✅ Occupation analysis by country

### Bonus Features
- 🎨 Stunning retro-futuristic UI design
- 📊 Interactive Chart.js visualizations
- 📤 Custom CSV upload functionality
- 🔍 Real-time data filtering
- 📥 Export data to CSV
- 📱 Fully responsive design
- 🌙 Dark/Light theme toggle

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/soufianezekaoui/demographic-analyzer.git
   cd demographic-analyzer
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Add the dataset**
   - Download `adult.data.csv` from UCI ML Repository
   - Place it in the `data/` folder
   - Or get it from: https://github.com/freeCodeCamp/boilerplate-demographic-data-analyzer

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
demographic-analyzer/
│
├── app.py                           # Flask backend (API routes)
├── requirements.txt                 # Python dependencies
│
├── templates/
│   └── index.html                   # Main dashboard HTML
│
├── static/
│   ├── css/
│   │   └── style.css                # Glassmorphism styling
│   └── js/
│       └── main.js                  # Interactive functionality
│
└── data/
    ├── adult.data.csv               # Census dataset
    └── uploads/                     # User uploaded CSVs
```

## 🎨 Design Philosophy

### Census Vision 1994 Theme
- **Color Palette**: Cyberpunk-inspired (cyan, purple, orange)
- **Typography**: Space Grotesk (headings), Inter (body), JetBrains Mono (data)
- **Effects**: Glassmorphism cards, smooth animations, gradient accents
- **Layout**: Responsive grid system with Chart.js visualizations

## 📊 API Endpoints

### GET Endpoints
```
GET /                           # Main dashboard
GET /api/statistics             # All demographic statistics
GET /api/race-distribution      # Race breakdown data
GET /api/education-breakdown    # Education vs income data
GET /api/country-analysis       # Geographic analysis
GET /api/age-distribution       # Age group breakdown
```

### POST Endpoints
```
POST /api/upload               # Upload custom CSV
POST /api/filter               # Apply data filters
```

## 🛠️ Technologies Used

### Backend
- **Flask 3.0**  - Web framework
- **Pandas 2.1** - Data analysis
- **NumPy 1.26** - Numerical computations
- **Flask-CORS** - API access

### Frontend
- **HTML5**              - Structure
- **CSS3**               - Styling (Glassmorphism design)
- **Vanilla JavaScript** - Interactivity
- **Chart.js 4.4**       - Data visualizations
- **Font Awesome 6**     - Icons
- **Google Fonts**       - Typography

## 📈 Data Analysis

### Questions Answered
1. How many people of each race are represented?
2. What is the average age of men?
3. What percentage have a Bachelor's degree?
4. What percentage with advanced education earn >50K?
5. What percentage without advanced education earn >50K?
6. What is the minimum number of hours worked per week?
7. What percentage of minimum hour workers earn >50K?
8. Which country has the highest percentage earning >50K?
9. What is the most popular occupation in India for high earners?

### Data Source
- **Dataset**   : 1994 US Census Database
- **Records**   : 32,561 individuals
- **Attributes**: 15 demographic features
- **Source**    : UCI Machine Learning Repository

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ **Pandas mastery**        : Data filtering, grouping, aggregation
- ✅ **Flask development**     : REST API, routing, file uploads
- ✅ **Data visualization**    : Chart.js integration
- ✅ **Frontend design**       : Glassmorphism, responsive layouts
- ✅ **Full-stack integration**: Backend API + Frontend UI

## 🎯 Future Enhancements

- [ ] Add more chart types (scatter plots, heatmaps)
- [ ] Machine learning predictions
- [ ] User authentication
- [ ] Save custom reports
- [ ] Export to PDF
- [ ] Multi-dataset comparison

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **freeCodeCamp**      - For the amazing Data Analysis curriculum
- **UCI ML Repository** - For the census dataset
- **Chart.js**          - For beautiful visualizations

## 👨‍💻 Author

**Your Name**
- GitHub: [@soufianezekaoui](https://github.com/soufianezekaoui)
- LinkedIn: [Soufiane Zekaoui](https://linkedin.com/in/soufiane-zekaoui-445b1b352/)
- Portfolio: [My-Personal-Website](https://soufianezekaoui.github.io/my_soufianeze_portfolio/)

---

**Built with ❤️ for the freeCodeCamp Data Analysis with Python Certification**

⭐ Star this repo if you found it helpful!
