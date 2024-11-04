// Apply color pattern to each letter of the navbar text

function applyColorPattern(element, colors) {
    let text = element.innerText;
    let coloredText = '';

    for (let i = 0; i < text.length; i++) {
        let color = colors[i % colors.length]; // Cycle through colors
        let letter = text[i] === ' ' ? '&nbsp;' : text[i]; // Preserve spaces
        coloredText += `<span style="color: ${color};">${letter}</span>`; // Use backticks for template literal
    }

    element.innerHTML = coloredText; // Update the element with colored text
}

// Define the color pattern
const colors = ['#68c9d2', '#f8c0bf', '#c2e0ba', '#e2be5e', '#68c9d2'];

// Apply the color pattern to the navbar text
const navbarText = document.getElementById('navbarText');
const inputCardText = document.getElementById('inputCardText');
const yourPassportCardText = document.getElementById('yourPassportID');
applyColorPattern(navbarText, colors);
applyColorPattern(inputCardText, colors);
applyColorPattern(yourPassportCardText, colors);

// Function to trigger file input click
function triggerFileInput() {
    document.getElementById('profileImage').click();
}

document.addEventListener('DOMContentLoaded', function () {
    // Clear uploads folder on page load
    fetch('/license/clear-uploads')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Uploads folder cleared');
            } else {
                console.error('Error clearing uploads folder');
            }
        })
        .catch(error => console.error('Error clearing uploads folder:', error));

    // Generate the default card on page load
    fetch('/license/generate-default')
        .then(response => response.json())
        .then(data => {
            if (data.imagePath) {
                updateGeneratedImage(data.imagePath);
            } else {
                console.error('Error loading default image');
            }
        })
        .catch(error => console.error('Error loading default image:', error));

    // Profile photo preview logic
    const profileImageInput = document.getElementById('profileImage');
    const profilePhotoDiv = document.getElementById('profilePhoto');
    const profilePreview = document.getElementById('profilePreview');

    profileImageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                profilePreview.src = event.target.result;
                profilePhotoDiv.classList.add('has-image');
                profilePhotoDiv.classList.remove('error');
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to collect form data, including selected stamp
    function collectFormData() {
        const formData = new FormData();
        formData.append('issuedTo', document.getElementById('issuedTo').value || '');
        formData.append('dob', document.getElementById('dob').value || '');
        formData.append('placeOfIssue', document.getElementById('placeOfIssue').value || '');
        formData.append('dateOfIssue', document.getElementById('dateOfIssue').value || '');
        formData.append('backgroundColor', document.getElementById('backgroundColor').value || '#faefcf');
        formData.append('signature', document.getElementById('signature').value || '');
        formData.append('fontSelect', document.getElementById('fontSelect').value || '');
        formData.append('stampSelect', document.getElementById('stampSelect').value || 'blank');

        if (profileImageInput.files.length > 0) {
            formData.append('profileImage', profileImageInput.files[0]);
        } else {
            formData.append('profileImage', 'public/blank.png');
        }

        return formData;
    }

    // Function to update image preview
    function updateImage() {
        const formData = collectFormData();

        fetch('/license/generate', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.imagePath) {
                updateGeneratedImage(data.imagePath);
            } else {
                console.error('Error:', data.error || 'Unknown error');
            }
        })
        .catch(error => console.error('Error submitting form:', error));
    }

    // Function to update image element
    function updateGeneratedImage(imagePath) {
        const generatedImage = document.getElementById('generatedImage');
        generatedImage.src = imagePath + '?t=' + new Date().getTime();
    }

    // Event listeners for live updates on input changes
    document.getElementById('issuedTo').addEventListener('blur', updateImage);
    document.getElementById('dob').addEventListener('change', updateImage);
    document.getElementById('placeOfIssue').addEventListener('blur', updateImage);
    document.getElementById('dateOfIssue').addEventListener('change', updateImage);
    document.getElementById('signature').addEventListener('blur', updateImage);
    document.getElementById('profileImage').addEventListener('change', updateImage);
    
        // Debounce function to limit how often a function is called
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Apply the debounce to the color picker event listener
    document.getElementById('backgroundColor').addEventListener('input', debounce(() => {
        updateImage();
    }, 300)); 

    // Event listener for font dropdown
    document.querySelectorAll('#fontDropdownContent .dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            const selectedFont = this.getAttribute('data-font');
            const selectedText = this.innerText;

            document.getElementById('fontDropdownButton').innerText = selectedText;
            document.getElementById('fontSelect').value = selectedFont;

            const signatureInput = document.getElementById('signature');
            const dropdownButton = document.getElementById('fontDropdownButton');
            signatureInput.style.fontFamily = selectedFont;
            document.getElementById('fontDropdownButton').style.fontFamily = selectedFont;

            switch (selectedFont) {
                case 'RockSaltRegular':
                    signatureInput.style.fontSize = '18px';
                    //signatureInput.style.padding = '20px 12px';
                    dropdownButton.style.fontSize = '16px';
                    break;
                case 'circhand':
                    signatureInput.style.fontSize = '30px';
                    signatureInput.style.padding = '8px 10px';
                    dropdownButton.style.fontSize = '30px';
                    break;
                case 'PizzaismyFAVORITE':
                    signatureInput.style.fontSize = '22px';
                    signatureInput.style.padding = '6px 8px';
                    dropdownButton.style.fontSize = '18px';
                    //dropdownButton.style.padding = '0px 2px 2px 2px';
                    break;
                case 'rans':
                    signatureInput.style.fontSize = '22px';
                    signatureInput.style.padding = '12px 14px';
                    dropdownButton.style.fontSize = '22px';
                    break;
                case 'Domestic_Manners':
                    signatureInput.style.fontSize = '20px';
                    signatureInput.style.padding = '8px 10px';
                    dropdownButton.style.fontSize = '20px';
                    break;
                case 'FontForErin':
                    signatureInput.style.fontSize = '24px';
                    signatureInput.style.padding = '10px 14px';
                    dropdownButton.style.fontSize = '24px';
                    break;
                case 'irrep':
                    signatureInput.style.fontSize = '25px';
                    signatureInput.style.padding = '10px 12px';
                    dropdownButton.style.fontSize = '25px';
                    //dropdownButton.style.fontSize = '25px';
                    break;
                case 'Scrawler':
                    signatureInput.style.fontSize = '27px';
                    signatureInput.style.padding = '12px 14px';
                    dropdownButton.style.fontSize = '27px';
                    break;
                case 'Snake':
                    signatureInput.style.fontSize = '27px';
                    signatureInput.style.padding = '10px 12px';
                    dropdownButton.style.fontSize = '27px';
                    break;
                case 'UglyDaveAlternates':
                    signatureInput.style.fontSize = '25px';
                    signatureInput.style.padding = '8px 10px';
                    dropdownButton.style.fontSize = '25px';
                    break;
                case 'VtksGarotaBonita':
                    signatureInput.style.fontSize = '20px';
                    signatureInput.style.padding = '8px 10px';
                    dropdownButton.style.fontSize = '20px';
                    break;
                case 'Zeyada':
                    signatureInput.style.fontSize = '30px';
                    signatureInput.style.padding = '8px 12px';
                    dropdownButton.style.fontSize = '30px';
                    break;
                default:
                    signatureInput.style.fontSize = '16px'; // Default size
                    signatureInput.style.padding = '10px 12px'; // Default padding
                    dropdownButton.style.fontSize = '16px'; // Default dropdown size
                    break;
            }


            updateImage();
             
        });
    });

    //Event listener for stamp dropdown
    document.querySelectorAll('#stampDropdownContent .dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            const selectedStamp = this.getAttribute('data-stamp');
            const selectedText = this.innerText;

            document.getElementById('stampDropdownButton').innerText = selectedText;
            document.getElementById('stampSelect').value = selectedStamp;

            // Optional: update the preview immediately
            updateImage();
        });
    });


    fontSelect.addEventListener('change', function () {
        const selectedFont = fontSelect.value || 'Arial';
        signatureInput.style.fontFamily = selectedFont;
        adjustFontStyles(selectedFont);
    });

    
});




// Function to trigger the download of the generated image
document.getElementById('downloadButton').addEventListener('click', function () {
    const generatedImage = document.getElementById('generatedImage');
    if (generatedImage && generatedImage.src) {
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = 'GeneratedPassport.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// Function to share the generated image on X (Twitter)
document.getElementById('shareButton').addEventListener('click', function () {
    const shareURL = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out my generated passport!");
    const xURL = `https://twitter.com/intent/tweet?url=${shareURL}&text=${shareText}`;
    window.open(xURL, '_blank');
});

// CSS Style for .error class
const style = document.createElement('style');
style.innerHTML = `
    .profile-photo.error {
        border: 2px dashed red;
    }
`;
document.head.appendChild(style);
