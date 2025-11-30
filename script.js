document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('text-input');
    const generateBtn = document.getElementById('generate-btn');
    const outputContainer = document.getElementById('output-container');
    const outputWrapper = document.getElementById('output-wrapper');
    const fontSizeSlider = document.getElementById('font-size');
    const sizeValue = document.getElementById('size-value');
    const bgColorPicker = document.getElementById('bg-color');
    const bgUpload = document.getElementById('bg-upload');
    const clearBgBtn = document.getElementById('clear-bg');
    const downloadBtn = document.getElementById('download-btn');
    const saveBtn = document.getElementById('save-btn');

    // Character to image mapping
    const charToImageMap = {
        'A' 'a': 'A.png', 'B': 'B.png', 'C': 'C.png', 'D': 'D.png', 'E': 'E.png',
        'F': 'F.png', 'G': 'G.png', 'H': 'H.png', 'I': 'I.png', 'J': 'J.png',
        'K': 'K.png', 'L': 'L.png', 'M': 'M.png', 'N': 'N.png', 'O': 'O.png',
        'P': 'P.png', 'Q': 'Q.png', 'R': 'R.png', 'S': 'S.png', 'T': 'T.png',
        'U': 'U.png', 'V': 'V.png', 'W': 'W.png', 'X': 'X.png', 'Y': 'Y.png',
        'Z': 'Z.png', 'a': 'A.png', 'b': 'B.png', 'c': 'C.png', 'd': 'D.png',
        'e': 'E.png', 'f': 'F.png', 'g': 'G.png', 'h': 'H.png', 'i': 'I.png',
        'j': 'J.png', 'k': 'K.png', 'l': 'L.png', 'm': 'M.png', 'n': 'N.png',
        'o': 'O.png', 'p': 'P.png', 'q': 'Q.png', 'r': 'R.png', 's': 'S.png',
        't': 'T.png', 'u': 'U.png', 'v': 'V.png', 'w': 'W.png', 'x': 'X.png',
        'y': 'Y.png', 'z': 'Z.png'
    };

    // Initialize the app
    function init() {
        updateSizeValue();
        loadSavedText();
        setupEventListeners();
    }

    // Update font size display
    function updateSizeValue() {
        sizeValue.textContent = `${fontSizeSlider.value}px`;
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Font size slider
        fontSizeSlider.addEventListener('input', function() {
            updateSizeValue();
            if (outputContainer.innerHTML) {
                generateKweenSans();
            }
        });

        // Background color change
        bgColorPicker.addEventListener('input', function() {
            outputWrapper.style.backgroundImage = 'none';
            outputWrapper.style.backgroundColor = this.value;
        });

        // Background image upload
        bgUpload.addEventListener('change', handleBackgroundUpload);

        // Clear background
        clearBgBtn.addEventListener('click', clearBackground);

        // Generate button
        generateBtn.addEventListener('click', generateKweenSans);

        // Download button
        downloadBtn.addEventListener('click', downloadImage);

        // Save button
        saveBtn.addEventListener('click', saveTextConfiguration);

        // Generate on Enter key (with Ctrl/Cmd)
        textInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                generateKweenSans();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            // Regenerate text to ensure proper sizing on orientation change
            if (outputContainer.innerHTML) {
                setTimeout(generateKweenSans, 100);
            }
        });
    }

    // Handle background image upload
    function handleBackgroundUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please select an image smaller than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            outputWrapper.style.backgroundImage = `url(${event.target.result})`;
            outputWrapper.style.backgroundSize = 'cover';
            outputWrapper.style.backgroundPosition = 'center';
            outputWrapper.style.backgroundColor = 'transparent';
        };
        reader.onerror = function() {
            alert('Error reading the file. Please try again.');
        };
        reader.readAsDataURL(file);
    }

    // Clear background
    function clearBackground() {
        outputWrapper.style.backgroundImage = 'none';
        outputWrapper.style.backgroundColor = '#ffffff';
        bgColorPicker.value = '#ffffff';
        bgUpload.value = '';
    }

    // Generate Kween Sans text
    function generateKweenSans() {
        const inputText = textInput.value.trim();
        const fontSize = fontSizeSlider.value;
        
        // Clear previous output
        outputContainer.innerHTML = '';
        
        if (!inputText) {
            outputContainer.innerHTML = '<p class="fallback-character" style="font-size: 16px; color: #666;">Please enter some text to transform.</p>';
            return;
        }
        
        // Process each character
        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];
            const imageName = charToImageMap[char];
            
            if (imageName) {
                createCharacterImage(char, imageName, fontSize);
            } else {
                createFallbackCharacter(char, fontSize);
            }
        }
    }

    // Create character image element
    function createCharacterImage(char, imageName, fontSize) {
        const img = document.createElement('img');
        img.src = `images/${imageName}`;
        img.alt = char;
        img.className = 'character-image';
        img.style.height = `${fontSize}px`;
        img.loading = 'lazy'; // Improve performance on mobile
        
        img.onerror = function() {
            // If image doesn't exist, show the character as text
            this.remove();
            createFallbackCharacter(char, fontSize);
        };
        
        outputContainer.appendChild(img);
    }

    // Create fallback character (text)
    function createFallbackCharacter(char, fontSize) {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'fallback-character';
        span.style.fontSize = `${fontSize}px`;
        span.style.lineHeight = '1';
        outputContainer.appendChild(span);
    }

    // Download as image
    function downloadImage() {
        if (!outputContainer.innerHTML || outputContainer.textContent === 'Please enter some text to transform.') {
            alert('Please generate some text first!');
            return;
        }
        
        // Show loading state
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generating...';
        downloadBtn.disabled = true;
        
        // Use html2canvas to capture the output
        html2canvas(outputWrapper, {
            backgroundColor: outputWrapper.style.backgroundColor || '#ffffff',
            scale: 2, // Higher quality for download
            useCORS: true,
            logging: false
        }).then(canvas => {
            try {
                const link = document.createElement('a');
                link.download = `kween-sans-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('Error downloading image:', error);
                alert('Error generating image. Please try again.');
            }
        }).catch(error => {
            console.error('html2canvas error:', error);
            alert('Error capturing the image. Please try again.');
        }).finally(() => {
            // Restore button state
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        });
    }

    // Save text configuration
    function saveTextConfiguration() {
        const textData = {
            text: textInput.value,
            fontSize: fontSizeSlider.value,
            backgroundColor: outputWrapper.style.backgroundColor || '#ffffff',
            backgroundImage: outputWrapper.style.backgroundImage || 'none'
        };
        
        try {
            localStorage.setItem('kweenSansData', JSON.stringify(textData));
            showNotification('Text configuration saved!');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Error saving configuration. Your browser may not support this feature.');
        }
    }

    // Load saved text configuration
    function loadSavedText() {
        try {
            const savedData = localStorage.getItem('kweenSansData');
            if (savedData) {
                const data = JSON.parse(savedData);
                textInput.value = data.text || 'Hello World';
                fontSizeSlider.value = data.fontSize || 50;
                updateSizeValue();
                
                if (data.backgroundImage && data.backgroundImage !== 'none') {
                    outputWrapper.style.backgroundImage = data.backgroundImage;
                    outputWrapper.style.backgroundSize = 'cover';
                    outputWrapper.style.backgroundPosition = 'center';
                } else if (data.backgroundColor) {
                    outputWrapper.style.backgroundColor = data.backgroundColor;
                    bgColorPicker.value = data.backgroundColor;
                }
                
                generateKweenSans();
            } else {
                // Generate initial example text
                generateKweenSans();
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            // Generate with default values
            generateKweenSans();
        }
    }

    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1000;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Initialize the application
    init();
});

