class MovieSelfieMatcher {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupDragAndDrop();
        this.mockData = this.initializeMockData();
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.fileInput = document.getElementById('fileInput');
        this.previewImage = document.getElementById('previewImage');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.clearBtn = document.getElementById('clearBtn');

        // Results elements
        this.resultsContent = document.getElementById('resultsContent');
        this.resultsPlaceholder = document.getElementById('resultsPlaceholder');
        this.resultsDisplay = document.getElementById('resultsDisplay');
        this.loadingState = document.getElementById('loadingState');
        this.resultsActions = document.getElementById('resultsActions');

        // Match details elements
        this.matchedImage = document.getElementById('matchedImage');
        this.matchedName = document.getElementById('matchedName');
        this.matchedMovie = document.getElementById('matchedMovie');
        this.confidenceFill = document.getElementById('confidenceFill');
        this.confidenceValue = document.getElementById('confidenceValue');

        // Action buttons
        this.shareBtn = document.getElementById('shareBtn');
        this.retryBtn = document.getElementById('retryBtn');
    }

    bindEvents() {
        // Upload events
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.clearBtn.addEventListener('click', () => this.clearImage());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Action events
        this.shareBtn.addEventListener('click', () => this.shareResult());
        this.retryBtn.addEventListener('click', () => this.resetApplication());
    }

    setupDragAndDrop() {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.remove('drag-over');
            }, false);
        });

        // Handle dropped files
        this.uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB.');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayPreview(e.target.result);
            this.processImage();
        };
        reader.readAsDataURL(file);
    }

    displayPreview(imageSrc) {
        this.previewImage.src = imageSrc;
        this.previewImage.style.display = 'block';
        this.uploadPlaceholder.style.display = 'none';
        this.clearBtn.style.display = 'inline-flex';
        
        // Add animation
        this.previewImage.classList.add('fade-in-up');
    }

    clearImage() {
        this.previewImage.style.display = 'none';
        this.uploadPlaceholder.style.display = 'flex';
        this.clearBtn.style.display = 'none';
        this.fileInput.value = '';
        this.resetResults();
    }

    resetResults() {
        this.resultsPlaceholder.style.display = 'flex';
        this.resultsDisplay.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.resultsActions.style.display = 'none';
    }

    processImage() {
        // Show loading state
        this.showLoading();

        // Simulate API processing time
        setTimeout(() => {
            this.displayResults();
        }, 3000);
    }

    showLoading() {
        this.resultsPlaceholder.style.display = 'none';
        this.resultsDisplay.style.display = 'none';
        this.loadingState.style.display = 'flex';
        this.resultsActions.style.display = 'none';
    }

    displayResults() {
        // Get random match from mock data
        const randomMatch = this.getRandomMatch();
        
        // Hide loading and placeholder
        this.loadingState.style.display = 'none';
        this.resultsPlaceholder.style.display = 'none';
        
        // Populate match details
        this.matchedImage.src = randomMatch.image;
        this.matchedName.textContent = randomMatch.name;
        this.matchedMovie.textContent = randomMatch.movie;
        
        // Animate confidence bar
        const confidence = randomMatch.confidence;
        this.confidenceValue.textContent = `${confidence}%`;
        
        // Show results with animation
        this.resultsDisplay.style.display = 'block';
        this.resultsDisplay.classList.add('fade-in-up');
        
        // Animate confidence bar after a short delay
        setTimeout(() => {
            this.confidenceFill.style.width = `${confidence}%`;
        }, 500);
        
        // Show action buttons
        setTimeout(() => {
            this.resultsActions.style.display = 'flex';
            this.resultsActions.classList.add('fade-in-up');
        }, 1000);
    }

    getRandomMatch() {
        return this.mockData[Math.floor(Math.random() * this.mockData.length)];
    }

    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: 'My Movie Doppelganger',
                text: `I found my movie doppelganger: ${this.matchedName.textContent}!`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback for browsers without Web Share API
            const shareText = `I found my movie doppelganger: ${this.matchedName.textContent}! Check it out at ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showSuccess('Share link copied to clipboard!');
            }).catch(() => {
                this.showError('Unable to copy share link.');
            });
        }
    }

    resetApplication() {
        this.clearImage();
        this.resetResults();
    }

    showError(message) {
        // Simple error notification (you could enhance this with a toast system)
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        // Simple success notification (you could enhance this with a toast system)
        alert(`Success: ${message}`);
    }

    initializeMockData() {
        // Mock celebrity data with Pexels images
        return [
            {
                name: 'Leonardo DiCaprio',
                movie: 'Inception (2010)',
                confidence: Math.floor(Math.random() * 20) + 80,
                image: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Scarlett Johansson',
                movie: 'Black Widow (2021)',
                confidence: Math.floor(Math.random() * 20) + 75,
                image: 'https://images.pexels.com/photos/3584283/pexels-photo-3584283.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Ryan Gosling',
                movie: 'La La Land (2016)',
                confidence: Math.floor(Math.random() * 20) + 82,
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Emma Stone',
                movie: 'La La Land (2016)',
                confidence: Math.floor(Math.random() * 20) + 78,
                image: 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Chris Evans',
                movie: 'Captain America (2011)',
                confidence: Math.floor(Math.random() * 20) + 85,
                image: 'https://images.pexels.com/photos/2379003/pexels-photo-2379003.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Margot Robbie',
                movie: 'Barbie (2023)',
                confidence: Math.floor(Math.random() * 20) + 79,
                image: 'https://images.pexels.com/photos/3618162/pexels-photo-3618162.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Tom Holland',
                movie: 'Spider-Man (2017)',
                confidence: Math.floor(Math.random() * 20) + 83,
                image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Zendaya',
                movie: 'Dune (2021)',
                confidence: Math.floor(Math.random() * 20) + 81,
                image: 'https://images.pexels.com/photos/3094216/pexels-photo-3094216.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Michael B. Jordan',
                movie: 'Black Panther (2018)',
                confidence: Math.floor(Math.random() * 20) + 77,
                image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            },
            {
                name: 'Gal Gadot',
                movie: 'Wonder Woman (2017)',
                confidence: Math.floor(Math.random() * 20) + 86,
                image: 'https://images.pexels.com/photos/3584284/pexels-photo-3584284.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
            }
        ];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MovieSelfieMatcher();
});

// Add some smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add a simple fade-in animation for the page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});