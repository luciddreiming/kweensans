document.addEventListener('DOMContentLoaded', function() {
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
        'A': 'A.png',
        'B': 'B.png',
        'C': 'C.png',
        'D': 'D.png',
        'E': 'E.png',
        'F': 'F.png',
        'G': 'G.png',
        'H': 'H.png',
        'I': 'I.png',
        'J': 'J.png',
        'K': 'K.png',
        'L': 'L.png',
        'M': 'M.png',
        'N': 'N.png',
        'O': 'O.png',
        'P': 'P.png',
        'Q': 'Q.png',
        'R': 'R.png',
        'S': 'S.png',
        'T': 'T.png',
        'U': 'U.png',
        'V': 'V.png',
        'W': 'W.png',
        'X': 'X.png',
        'Y': 'Y.png',
        'Z': 'Z.png',
        'a': 'a.png',
        'b': 'b.png',
        'c': 'c.png',
        'd': 'd.png',
        'e': 'e.png',
        'f': 'f.png',
        'g': 'g.png',
        'h': 'h.png',
        'i': 'i.png',
        'j': 'j.png',
        'k': 'k.png',
        'l': 'l.png',
        'm': 'm.png',
        'n': 'n.png',
        'o': 'o.png',
        'p': 'p.png',
        'q': 'q.png',
        'r': 'r.png',
        's': 's.png',
        't': 't.png',
        'u': 'u.png',
        'v': 'v.png',
        'w': 'w.png',
        'x': 'x.png',
        'y': 'y.png',
        'z': 'z.png',
    };
    
    // Update font size display
    fontSizeSlider.addEventListener('input', function() {
        sizeValue.textContent = `${this.value}px`;
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
    bgUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                outputWrapper.style.backgroundImage = `url(${event.target.result})`;
                outputWrapper.style.backgroundSize = 'cover';
                outputWrapper.style.backgroundPosition = 'center';
                outputWrapper.style.backgroundColor = 'transparent';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Clear background
    clearBgBtn.addEventListener('click', function() {
        outputWrapper.style.backgroundImage = 'none';
        outputWrapper.style.backgroundColor = '#ffffff';
        bgColorPicker.value = '#ffffff';
        bgUpload.value = '';
    });
    
    // Function to generate Kween Sans text
    function generateKweenSans() {
        const inputText = textInput.value;
        const fontSize = fontSizeSlider.value;
        outputContainer.innerHTML = '';
        
        if (!inputText.trim()) {
            outputContainer.innerHTML = '<p>Please enter some text to transform.</p>';
            return;
        }
        
        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];
            const imageName = charToImageMap[char];
            
            if (imageName) {
                const img = document.createElement('img');
                img.src = `images/${imageName}`;
                img.alt = char;
                img.className = 'character-image';
                img.style.height = `${fontSize}px`;
                img.onerror = function() {
                    // If image doesn't exist, show the character as text
                    this.style.display = 'none';
                    const fallbackSpan = document.createElement('span');
                    fallbackSpan.textContent = char;
                    fallbackSpan.className = 'fallback-character';
                    fallbackSpan.style.fontSize = `${fontSize}px`;
                    outputContainer.appendChild(fallbackSpan);
                };
                outputContainer.appendChild(img);
            } else {
                // For unsupported characters, show them as text
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'fallback-character';
                span.style.fontSize = `${fontSize}px`;
                outputContainer.appendChild(span);
            }
        }
    }
    
    // Download as image
    downloadBtn.addEventListener('click', function() {
        if (!outputContainer.innerHTML) {
            alert('Please generate some text first!');
            return;
        }
        
        // Use html2canvas to capture the output
        if (typeof html2canvas === 'undefined') {
            // Load html2canvas library if not available
            const script = document.createElement('script');
            script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
            script.onload = captureOutput;
            document.head.appendChild(script);
        } else {
            captureOutput();
        }
        
        function captureOutput() {
            html2canvas(outputWrapper).then(canvas => {
                const link = document.createElement('a');
                link.download = 'kween-sans-text.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    });
    
    // Save text configuration
    saveBtn.addEventListener('click', function() {
        const textData = {
            text: textInput.value,
            fontSize: fontSizeSlider.value,
            backgroundColor: outputWrapper.style.backgroundColor,
            backgroundImage: outputWrapper.style.backgroundImage
        };
        
        localStorage.setItem('kweenSansData', JSON.stringify(textData));
        alert('Text configuration saved! It will be restored when you revisit this page.');
    });
    
    // Load saved text configuration
    function loadSavedText() {
        const savedData = localStorage.getItem('kweenSansData');
        if (savedData) {
            const data = JSON.parse(savedData);
            textInput.value = data.text;
            fontSizeSlider.value = data.fontSize;
            sizeValue.textContent = `${data.fontSize}px`;
            
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
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateKweenSans);
    
    // Generate on Enter key (with Ctrl/Cmd)
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            generateKweenSans();
        }
    });
    
    // Load saved text on page load
    loadSavedText();
});