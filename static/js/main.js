// APPLICATION STATE
// ============================================================================

const AppState = {
    data: null,
    charts: {},
    isLoading: false
};

// UTILITY FUNCTIONS
// ============================================================================

/**
 * Show/hide loading overlay
 */
function toggleLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
        AppState.isLoading = true;
    } else {
        overlay.classList.remove('active');
        AppState.isLoading = false;
    }
}

/**
 * Show modal
 */
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

/**
 * Hide modal
 */
function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

/**
 * Animate number counter
 */
function animateCounter(elementId, target, suffix = '') {
    const element = document.getElementById(elementId);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas
        const formatted = typeof target === 'number' && target > 100 
            ? Math.floor(current).toLocaleString()
            : current.toFixed(1);
        
        element.textContent = formatted + suffix;
    }, duration / steps);
}

/**
 * Fetch data from API
 */
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// DATA LOADING
// ============================================================================

/**
 * Load all statistics from API
 */
async function loadStatistics() {
    toggleLoading(true);
    
    try {
        const stats = await fetchAPI('/api/statistics');
        AppState.data = stats;
        
        // Update hero cards
        animateCounter('totalRecords', stats.total_records);
        animateCounter('avgAge', stats.average_age_men);
        animateCounter('bachelorsPct', stats.percentage_bachelors, '%');
        animateCounter('highIncome', stats.higher_education_rich, '%');
        
        // Update insight banner
        const multiplier = (stats.higher_education_rich / stats.lower_education_rich).toFixed(1);
        document.getElementById('eduMultiplier').textContent = multiplier + 'x';
        
        // Update work hours section
        document.getElementById('minHours').textContent = stats.min_work_hours;
        document.getElementById('minHoursPct').textContent = stats.rich_percentage + '%';
        document.getElementById('minHoursPct2').textContent = stats.rich_percentage + '%';
        
        // Update top country
        document.getElementById('topCountry').textContent = stats.highest_earning_country;
        document.getElementById('topCountryPct').textContent = stats.highest_earning_country_percentage + '%';
        
        // Update top occupation
        document.getElementById('topOccupation').textContent = stats.top_IN_occupation;
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        alert('Failed to load statistics. Please check if the server is running.');
    } finally {
        toggleLoading(false);
    }
}

/**
 * Load and render all charts
 */
async function loadCharts() {
    try {
        await renderRaceChart();
        await renderEducationChart();
        await renderCountryChart();
        await renderAgeChart();
        await loadEducationTable();
    } catch (error) {
        console.error('Error loading charts:', error);
    }
}

// CHART RENDERING
// ============================================================================

/**
 * Common Chart.js configuration
 */
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: '#8996a5',
                font: {
                    family: 'Inter',
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(19, 47, 76, 0.95)',
            titleColor: '#00e5ff',
            bodyColor: '#ffffff',
            borderColor: '#00e5ff',
            borderWidth: 1,
            padding: 12,
            displayColors: true
        }
    },
    scales: {
        y: {
            ticks: { color: '#8996a5' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
            ticks: { color: '#8996a5' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
    }
};

/**
 * Render Race Distribution Chart
 */
async function renderRaceChart() {
    const data = await fetchAPI('/api/race-distribution');
    
    const ctx = document.getElementById('raceChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (AppState.charts.race) {
        AppState.charts.race.destroy();
    }
    
    AppState.charts.race = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    '#00e5ff',
                    '#b388ff',
                    '#ff6e40',
                    '#00e676',
                    '#ffd600'
                ],
                borderWidth: 2,
                borderColor: '#132f4c'
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    position: 'right',
                    labels: {
                        color: '#8996a5',
                        font: { family: 'Inter', size: 12 },
                        padding: 15
                    }
                }
            }
        }
    });
}

/**
 * Render Education vs Income Chart
 */
async function renderEducationChart() {
    const data = await fetchAPI('/api/education-breakdown');
    
    // Sort by rich percentage
    data.sort((a, b) => b.rich_percentage - a.rich_percentage);
    
    // Take top 10
    const top10 = data.slice(0, 10);
    
    const ctx = document.getElementById('educationChart').getContext('2d');
    
    if (AppState.charts.education) {
        AppState.charts.education.destroy();
    }
    
    AppState.charts.education = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top10.map(item => item.education),
            datasets: [{
                label: 'Percentage Earning >50K',
                data: top10.map(item => item.rich_percentage),
                backgroundColor: 'rgba(0, 229, 255, 0.8)',
                borderColor: '#00e5ff',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            ...chartDefaults,
            indexAxis: 'y', // Horizontal bar chart
            scales: {
                x: {
                    ticks: { 
                        color: '#8996a5',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#8996a5' },
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Render Country Analysis Chart
 */
async function renderCountryChart() {
    const data = await fetchAPI('/api/country-analysis');
    
    const ctx = document.getElementById('countryChart').getContext('2d');
    
    if (AppState.charts.country) {
        AppState.charts.country.destroy();
    }
    
    AppState.charts.country = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.country),
            datasets: [{
                label: 'High Income Percentage',
                data: data.map(item => item.rich_percentage),
                backgroundColor: function(context) {
                    // Gradient colors
                    const colors = [
                        '#00e676', '#00e5ff', '#b388ff', 
                        '#ff6e40', '#ffd600'
                    ];
                    return colors[context.dataIndex % colors.length];
                },
                borderWidth: 2,
                borderColor: '#132f4c',
                borderRadius: 8
            }]
        },
        options: {
            ...chartDefaults,
            indexAxis: 'y',
            scales: {
                x: {
                    ticks: { 
                        color: '#8996a5',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { 
                        color: '#8996a5',
                        font: { size: 11 }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Render Age Distribution Chart
 */
async function renderAgeChart() {
    const data = await fetchAPI('/api/age-distribution');
    
    const ctx = document.getElementById('ageChart').getContext('2d');
    
    if (AppState.charts.age) {
        AppState.charts.age.destroy();
    }
    
    AppState.charts.age = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Population',
                data: Object.values(data),
                backgroundColor: 'rgba(179, 136, 255, 0.2)',
                borderColor: '#b388ff',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#b388ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#8996a5' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#8996a5' },
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Load Education Breakdown Table
 */
async function loadEducationTable() {
    const data = await fetchAPI('/api/education-breakdown');
    
    // Sort by total count descending
    data.sort((a, b) => b.total - a.total);
    
    const tbody = document.querySelector('#statsTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.education}</strong></td>
            <td>${item.total.toLocaleString()}</td>
            <td>${item.average_age}</td>
            <td>${item.rich_count.toLocaleString()}</td>
            <td><span class="text-primary">${item.rich_percentage}%</span></td>
        `;
        tbody.appendChild(row);
    });
}

// FILE UPLOAD
// ============================================================================

/**
 * Handle file upload
 */
async function handleFileUpload(file) {
    if (!file) return;
    
    toggleLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Success! Processed ${result.message}`);
            hideModal('uploadModal');
            
            // Reload all data and charts
            await loadStatistics();
            await loadCharts();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file. Please try again.');
    } finally {
        toggleLoading(false);
    }
}

// FILTERS
// ============================================================================

/**
 * Apply data filters
 */
async function applyFilters() {
    const filters = {
        min_age: parseInt(document.getElementById('minAge').value) || 20,
        max_age: parseInt(document.getElementById('maxAge').value) || 90,
        education: document.getElementById('educationFilter').value,
        sex: document.getElementById('sexFilter').value
    };
    
    toggleLoading(true);
    
    try {
        const response = await fetch('/api/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filters)
        });
        
        const result = await response.json();
        
        if (result.success) {
            hideModal('filterModal');
            
            // Update statistics with filtered data
            const stats = result.stats;
            
            animateCounter('totalRecords', result.filtered_count);
            animateCounter('avgAge', stats.average_age_men);
            animateCounter('bachelorsPct', stats.percentage_bachelors, '%');
            animateCounter('highIncome', stats.higher_education_rich, '%');
            
            alert(`Showing results for ${result.filtered_count.toLocaleString()} filtered records`);
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Filter error:', error);
        alert('Failed to apply filters. Please try again.');
    } finally {
        toggleLoading(false);
    }
}

/**
 * Reset filters
 */
function resetFilters() {
    document.getElementById('minAge').value = 20;
    document.getElementById('maxAge').value = 90;
    document.getElementById('educationFilter').value = 'all';
    document.getElementById('sexFilter').value = 'all';
    
    // Reload original data
    loadStatistics();
    loadCharts();
    
    hideModal('filterModal');
}

// EXPORT DATA
// ============================================================================

/**
 * Export table data to CSV
 */
function exportToCSV() {
    const table = document.getElementById('statsTable');
    const rows = table.querySelectorAll('tr');
    
    let csv = [];
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('th, td');
        const rowData = Array.from(cols).map(col => col.textContent);
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'census-statistics.csv';
    a.click();
    
    window.URL.revokeObjectURL(url);
}

// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Census Vision 1994 Initialized');
    
    // Load data on page load
    loadStatistics();
    loadCharts();
    
    // Upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
        showModal('uploadModal');
    });
    
    // Filter button
    document.getElementById('filterBtn').addEventListener('click', () => {
        showModal('filterModal');
    });
    
    // Close modals
    document.getElementById('closeUploadModal').addEventListener('click', () => {
        hideModal('uploadModal');
    });
    
    document.getElementById('closeFilterModal').addEventListener('click', () => {
        hideModal('filterModal');
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // File upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#b388ff';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#00e5ff';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#00e5ff';
        
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            handleFileUpload(file);
        } else {
            alert('Please upload a CSV file');
        }
    });
    
    // Filter actions
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    
    // Theme toggle (bonus feature)
    document.getElementById('themeBtn').addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = document.querySelector('#themeBtn i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });
});

// CONSOLE ART
// ============================================================================

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║               CENSUS VISION 1994                              ║
║            Demographic Data Analyzer                          ║
║                                                               ║
║  Built with ❤️ for freeCodeCamp Data Analysis Certification   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🎨 Design: Retro-Futuristic Glassmorphism
📊 Charts: Chart.js
🚀 Backend: Flask + Pandas
💾 Data: UCI ML Repository (1994 Census)

Ready to analyze! 🔬
`);
