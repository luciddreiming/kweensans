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
    const charCount = document.getElementById('char-count');
    const capsWarning = document.getElementById('caps-warning');

    // Character to image mapping (UPPERCASE ONLY)
    const charToImageMap = {
        'A': 'A.png', 'B': 'B.png', 'C': 'C.png', 'D': 'D.png', 'E': 'E.png',
        'F': 'F.png', 'G': 'G.png', 'H': 'H.png', 'I': 'I.png', 'J': 'J.png',
        'K': 'K.png', 'L': 'L.png', 'M': 'M.png', 'N': 'N.png', 'O': 'O.png',
        'P': 'P.png', 'Q': 'Q.png', 'R': 'R.png', 'S': 'S.png', 'T': 'T.png',
        'U': 'U.png', 'V': 'V.png', 'W': 'W.png', 'X': 'X.png', 'Y': 'Y.png',
        'Z': 'Z.png'
    };

    // Initialize the app
    function init() {
        updateSizeValue();
        updateCharCount();
        setupCapsLockDetection();
        loadSavedText();
        setupEventListeners();
    }

    // Update font size display
    function updateSizeValue() {
        sizeValue.textContent = `${fontSizeSlider.value}px`;
    }

    // Update character count
    function updateCharCount() {
        const count = textInput.value.length;
        charCount.textContent = count;
        
        if (count > 80) {
            charCount.classList.add('warning');
        } else {
            charCount.classList.remove('warning');
        }
    }

    // Caps Lock Detection
    function setupCapsLockDetection() {
        textInput.addEventListener('keydown', function(e) {
            // Check if it's a letter key
            if (e.key >= 'a' && e.key <= 'z') {
                // Show warning if lowercase letter is pressed (likely caps lock off)
                capsWarning.classList.remove('hidden');
            } else if (e.key >= 'A' && e.key <= 'Z') {
                // Hide warning if uppercase letter is pressed (caps lock on)
                capsWarning.classList.add('hidden');
            }
        });

        textInput.addEventListener('keyup', function(e) {
            // Also check on keyup for more reliable detection
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                capsWarning.classList.add('hidden');
            }
        });

        textInput.addEventListener('blur', function() {
            // Keep warning visible when not focused to remind users
            capsWarning.classList.remove('hidden');
        });

        textInput.addEventListener('focus', function() {
            // Check caps lock state on focus
            checkCapsLockState();
        });
    }

    // Check caps lock state
    function checkCapsLockState() {
        // This is a simple check - we'll assume caps lock is off initially
        // and rely on the key events for detection
        capsWarning.classList.remove('hidden');
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

        // Text input restrictions
        textInput.addEventListener('input', function(e) {
            // Convert to uppercase
            this.value = this.value.toUpperCase();
            
            // Remove any non-allowed characters (only A-Z, spaces, and commas)
            this.value = this.value.replace(/[^A-Z\s,]/g, '');
            
            updateCharCount();
        });

        // Prevent paste of non-uppercase text
        textInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text').toUpperCase();
            const cleanedText = pastedText.replace(/[^A-Z\s,]/g, '');
            
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + cleanedText + this.value.substring(end);
            
            this.selectionStart = this.selectionEnd = start + cleanedText.length;
            
            updateCharCount();
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
            
            // Prevent entering lowercase letters
            if (e.key >= 'a' && e.key <= 'z') {
                e.preventDefault();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (outputContainer.innerHTML) {
                setTimeout(generateKweenSans, 100);
            }
        });
    }

    // Handle background image upload
    function handleBackgroundUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }

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

    // Generate Kween Sans text with multi-line support and word wrapping
    function generateKweenSans() {
        const inputText = textInput.value.trim();
        const fontSize = fontSizeSlider.value;
        
        // Clear previous output
        outputContainer.innerHTML = '';
        
        if (!inputText) {
            outputContainer.innerHTML = '<p class="fallback-character" style="font-size: 16px; color: #666;">Please enter some UPPERCASE text to transform.</p>';
            return;
        }
        
        // Split text by commas to create multiple lines
        const lines = inputText.split(',');
        let hasValidContent = false;
        
        // Process each line
        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            // Create a container for this line
            const lineContainer = document.createElement('div');
            lineContainer.className = 'text-line';
            
            // Split line into words for proper word wrapping
            const words = trimmedLine.split(/\s+/).filter(word => word.length > 0);
            
            // Process each word
            words.forEach((word, wordIndex) => {
                // Create a word group container
                const wordGroup = document.createElement('div');
                wordGroup.className = 'word-group';
                
                // Process each character in the word
                for (let i = 0; i < word.length; i++) {
                    const char = word[i];
                    const imageName = charToImageMap[char];
                    
                    if (imageName) {
                        createCharacterImage(char, imageName, fontSize, wordGroup);
                        hasValidContent = true;
                    }
                }
                
                // Only add the word group if it has content
                if (wordGroup.children.length > 0) {
                    lineContainer.appendChild(wordGroup);
                    
                    // Add space after word (except for the last word)
                    if (wordIndex < words.length - 1) {
                        const space = document.createElement('div');
                        space.className = 'space-character';
                        lineContainer.appendChild(space);
                    }
                }
            });
            
            // Only add the line if it has content
            if (lineContainer.children.length > 0) {
                outputContainer.appendChild(lineContainer);
            }
        });
        
        // Show message if no valid characters were processed
        if (!hasValidContent) {
            outputContainer.innerHTML = '<p class="fallback-character" style="font-size: 16px; color: #666;">No valid uppercase letters found. Please type A-Z characters.</p>';
        }
        
        // Apply word wrapping for long lines
        applyWordWrapping();
    }

    // Apply word wrapping to prevent overflow
    function applyWordWrapping() {
        const outputWidth = outputWrapper.clientWidth - 40; // Account for padding
        const lines = outputContainer.querySelectorAll('.text-line');
        
        lines.forEach(line => {
            const wordGroups = Array.from(line.querySelectorAll('.word-group'));
            let currentLine = document.createElement('div');
            currentLine.className = 'text-line';
            currentLine.style.marginBottom = '0';
            
            let currentWidth = 0;
            
            wordGroups.forEach((wordGroup, index) => {
                const wordWidth = getElementWidth(wordGroup);
                
                // If adding this word would exceed the width, start a new line
                if (currentWidth + wordWidth > outputWidth && currentWidth > 0) {
                    // Add the current line to the container
                    outputContainer.insertBefore(currentLine, line);
                    
                    // Create a new line
                    currentLine = document.createElement('div');
                    currentLine.className = 'text-line';
                    currentLine.style.marginBottom = '0';
                    currentWidth = 0;
                }
                
                // Add word to current line
                currentLine.appendChild(wordGroup.cloneNode(true));
                currentWidth += wordWidth;
                
                // Add space after word (except for the last word)
                if (index < wordGroups.length - 1) {
                    const space = document.createElement('div');
                    space.className = 'space-character';
                    currentLine.appendChild(space);
                    currentWidth += 20; // Approximate space width
                }
            });
            
            // Replace the original line with the wrapped lines
            if (currentLine.children.length > 0) {
                outputContainer.insertBefore(currentLine, line);
            }
            line.remove();
        });
    }

    // Helper function to get element width
    function getElementWidth(element) {
        const clone = element.cloneNode(true);
        clone.style.visibility = 'hidden';
        clone.style.position = 'absolute';
        document.body.appendChild(clone);
        const width = clone.offsetWidth;
        document.body.removeChild(clone);
        return width;
    }

    // Create character image element and add to word group
    function createCharacterImage(char, imageName, fontSize, wordGroup) {
        const img = document.createElement('img');
        img.src = `images/${imageName}`;
        img.alt = char;
        img.className = 'character-image';
        img.style.height = `${fontSize}px`;
        img.loading = 'lazy';
        
        img.onerror = function() {
            this.remove();
            createFallbackCharacter(char, fontSize, wordGroup);
        };
        
        wordGroup.appendChild(img);
    }

    // Create fallback character (text) and add to word group
    function createFallbackCharacter(char, fontSize, wordGroup) {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'fallback-character';
        span.style.fontSize = `${fontSize}px`;
        span.style.lineHeight = '1';
        wordGroup.appendChild(span);
    }
    // Load saved text configuration
    function loadSavedText() {
        try {
            const savedData = localStorage.getItem('kweenSansData');
            if (savedData) {
                const data = JSON.parse(savedData);
                textInput.value = data.text || 'HELLO WORLD, WELCOME TO KWEEN SANS, ENJOY CREATING BEAUTIFUL TEXT';
                fontSizeSlider.value = data.fontSize || 50;
                updateSizeValue();
                updateCharCount();
                
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
                generateKweenSans();
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            generateKweenSans();
        }
    }

    // Show notification
    function showNotification(message) {
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
