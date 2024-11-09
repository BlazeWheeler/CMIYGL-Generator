
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');


// Register all custom fonts
registerFont(path.join(__dirname, '../public/fonts/RockSaltRegular.ttf'), { family: 'RockSaltRegular' });
registerFont(path.join(__dirname, '../public/fonts/rans.ttf'), { family: 'rans' });
registerFont(path.join(__dirname, '../public/fonts/ASSIGN__.TTF'), { family: 'ASSIGN' });
registerFont(path.join(__dirname, '../public/fonts/circhand.ttf'), { family: 'circhand' });
registerFont(path.join(__dirname, '../public/fonts/Domestic_Manners.ttf'), { family: 'Domestic_Manners' });
registerFont(path.join(__dirname, '../public/fonts/FontForErin.ttf'), { family: 'FontForErin' });
registerFont(path.join(__dirname, '../public/fonts/irrep.ttf'), { family: 'irrep' });
registerFont(path.join(__dirname, '../public/fonts/PizzaismyFAVORITE.ttf'), { family: 'PizzaismyFAVORITE' });
registerFont(path.join(__dirname, '../public/fonts/Scrawler.ttf'), { family: 'Scrawler' });
registerFont(path.join(__dirname, '../public/fonts/Snake.ttf'), { family: 'Snake' });
registerFont(path.join(__dirname, '../public/fonts/UglyDaveAlternates.ttf'), { family: 'UglyDaveAlternates' });
registerFont(path.join(__dirname, '../public/fonts/Vtks Garota Bonita.ttf'), { family: 'VtksGarotaBonita' });
registerFont(path.join(__dirname, '../public/fonts/Zeyada.ttf'), { family: 'Zeyada' });


// Function to apply a stronger noise/grain filter to an image
function applyGrainEffect(imageData, intensity = 20) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity;
        data[i] += noise;     // Red
        data[i + 1] += noise; // Green
        data[i + 2] += noise; // Blue
    }
    return imageData;
}

// Function to generate the license image
/*
async function generateLicense(formData) {

    const { issuedTo, dob, placeOfIssue, dateOfIssue, signature, backgroundColor, profileImagePath, fontSelect, stamp } = formData;

    
    //signature = signature.toUpperCase;
    // Load the overlay, profile, and dirty overlay images
    const overlayImagePath = path.join(__dirname, '../public/cardOverlay.png');
    const dirtyOverlayPath = path.join(__dirname, '../public/dirtyOverlay.png');
    const profileImage = await loadImage(profileImagePath);
    const overlayImage = await loadImage(overlayImagePath);
    const dirtyOverlay = await loadImage(dirtyOverlayPath);

    // Load the selected stamp or default to blank.png if none selected
    const stampFile = stamp.endsWith('.png') ? stamp : `${stamp}.png`;
    const stampImagePath = path.join(__dirname, `../public/${stampFile}`);
    
 
    const stampImage = await loadImage(stampImagePath);

    // Create the canvas
    const canvas = createCanvas(820, 517);
    const ctx = canvas.getContext('2d');

    // Set padding and offset
    const padding = 30;
    const leftOffset = 10;
    const usableWidth = canvas.width - 2 * padding;
    const usableHeight = canvas.height - 2 * padding;

    // Fill background with the selected color and rounded corners
    ctx.fillStyle = backgroundColor;
    drawRoundedRect(ctx, padding, padding, usableWidth, usableHeight, 30); // Rounded corners
    ctx.fill();

    // Apply the dirty overlay with transparency to the background
    ctx.save();
    ctx.globalAlpha = 0.9;
    drawRoundedRect(ctx, padding, padding, usableWidth, usableHeight, 30);
    ctx.clip();
    ctx.drawImage(dirtyOverlay, padding, padding, usableWidth, usableHeight);
    ctx.restore();

    // Draw the profile image with slight tilt and shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    const profileCenterX = 225 + leftOffset;
    const profileCenterY = 250;
    const profileImageWidth = 300;
    const profileImageHeight = 300;
    const angle = -0.06;
    ctx.translate(profileCenterX, profileCenterY);
    ctx.rotate(angle);
    ctx.drawImage(profileImage, -profileImageWidth / 2, -profileImageHeight / 2, profileImageWidth, profileImageHeight);
    ctx.restore();

    // Apply grain effect to profile area
    const imageData = ctx.getImageData(profileCenterX - profileImageWidth / 2, profileCenterY - profileImageHeight / 2, profileImageWidth, profileImageHeight);
    const grainImageData = applyGrainEffect(imageData, 15);
    ctx.putImageData(grainImageData, profileCenterX - profileImageWidth / 2, profileCenterY - profileImageHeight / 2);

    // Draw the text elements
    ctx.fillStyle = '#000';
    ctx.font = '25px RockSaltRegular';



    ctx.fillText(`${issuedTo}`, padding + 460, padding + 115);
    ctx.fillText(`${dob}`, padding + 480, padding + 140);
    ctx.fillText(`${placeOfIssue}`, padding + 480, padding + 170);
    ctx.fillText(`${dateOfIssue}`, padding + 480, padding + 200);


    // Modify this part of the generateLicense function

if (signature && signature.trim() !== "") {
    const selectedFont = fontSelect || 'RockSaltRegular';

    // Set font size and padding based on the selected font
    switch (selectedFont) {
        case 'PizzaismyFAVORITE':
            ctx.font = `50px ${selectedFont}`;
            break;
        case 'circhand':
            ctx.font = `80px ${selectedFont}`;
            break;
        case 'Domestic_Manners':
            ctx.font = `50px ${selectedFont}`;
            break;
        case 'FontForErin':
            ctx.font = `55px ${selectedFont}`;
            break;
        case 'irrep':
            ctx.font = `58px ${selectedFont}`;
            break;
        case 'Scrawler':
            ctx.font = `85px ${selectedFont}`;
            break;
        case 'Snake':
            ctx.font = `60px ${selectedFont}`;
            break;
        case 'UglyDaveAlternates':
            ctx.font = `55px ${selectedFont}`;
            break;
        case 'VtksGarotaBonita':
            ctx.font = `55px ${selectedFont}`;
            break;
        case 'Zeyada':
            ctx.font = `56px ${selectedFont}`;
            break;
        case 'rans':
            ctx.font = `50px ${selectedFont}`;
            break;
        default:
            ctx.font = `35px ${selectedFont}`; // Default font size
            break;
    }

    ctx.fillText(signature, padding + 450, padding + 390);
}

    // Draw the stamp image over the stars and under the dirty overlay
    ctx.save();
    ctx.globalAlpha = 0.7; // Adjust opacity for the stamp

   // Position it above the signature, near the bottom right
   
    let stampPositionX = 400; 
    let stampPositionY = 160;
    let stampWidth = 350;
    let stampHeight = 350;


    if(stamp === 'callMeIfYouGetLostStamp'){ 
         stampPositionX = 400; 
         stampPositionY = 140;
         stampWidth = 350;
         stampHeight = 350;
    }

    if(stamp === 'xoStamp'){ 
        stampPositionX = 450; 
        stampPositionY = 190;
        stampWidth = 270;
        stampHeight = 270;
        
   }

    if(stamp === 'spacemanStamp'){ 
        stampPositionX = 470; 
        stampPositionY = 220;
        stampWidth = 230;
        stampHeight = 230;
   }

    if(stamp === 'DeceasedStamp'){ 
        stampPositionX = 400; 
        stampPositionY = 140;
        stampWidth = 350;
        stampHeight = 350;
   }

    if(stamp === 'PinkTapeStamp'){ 
        stampPositionX = 420; 
        stampPositionY = 160;
        stampWidth = 325;
        stampHeight = 325;
   }


   if (stamp === 'lsStamp') {
        stampWidth = 275; // Custom width for japanStamp
        stampHeight = 275; // Custom height for japanStamp
        stampPositionX =  440; // Position it above the signature, near the bottom right
        stampPositionY = 200;
    }

   if (stamp === 'neverHomeStamp') {
        stampPositionX = 420; 
        stampPositionY = 170;
        stampWidth = 300;
        stampHeight = 300;
    }

    if (stamp === 'japanStamp') {
        stampWidth = 200; // Custom width for japanStamp
        stampHeight = 200; // Custom height for japanStamp
         stampPositionX =  470; // Position it above the signature, near the bottom right
         stampPositionY = 220;
    }

    if (stamp === 'NasaStamp') {
         stampPositionX = 420; 
         stampPositionY = 190;
         stampWidth = 300;
         stampHeight = 300;
    }

    if (stamp === 'ApolloStamp') {
        stampPositionX = 460; 
        stampPositionY = 170;
        stampWidth = 300;
        stampHeight = 300;
   }

   if(stamp =='andromeda') { 
        stampPositionX = 450; 
        stampPositionY = 210;
        stampWidth = 225;
        stampHeight = 225;
   }


    ctx.drawImage(stampImage, stampPositionX, stampPositionY, stampHeight, stampWidth); // Adjust size and position as needed
    ctx.restore();

    // Draw the card overlay image on top
    ctx.globalAlpha = 1;
    ctx.drawImage(overlayImage, padding - leftOffset, padding, usableWidth + leftOffset, usableHeight);

    // Apply subtle grain effect to the entire card
    const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grainCanvasData = applyGrainEffect(canvasImageData, 10);
    ctx.putImageData(grainCanvasData, 0, 0);

    // Save the generated image
    const generatedDir = path.join(__dirname, '../public/generated');
    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir, { recursive: true });
    }
    const generatedImagePath = path.join(generatedDir, `${Date.now()}.png`);
    const out = fs.createWriteStream(generatedImagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    return new Promise((resolve, reject) => {
        out.on('finish', () => resolve(generatedImagePath));
        out.on('error', reject);
    });
}
*/
// Function to generate the license image
async function generateLicense(formData) {
    const { issuedTo, dob, placeOfIssue, dateOfIssue, signature, backgroundColor, profileImagePath, fontSelect, stamp } = formData;

    let convertedImagePath; // Temporary path for converted image if needed

    try {
        // Check if the uploaded image is in .webp format and convert it if necessary
        let finalProfileImagePath = profileImagePath;
        if (path.extname(profileImagePath).toLowerCase() === '.webp') {
            convertedImagePath = path.join(__dirname, '../uploads', `${Date.now()}.png`);
            await sharp(profileImagePath)
                .png()
                .toFile(convertedImagePath);
            finalProfileImagePath = convertedImagePath; // Use the converted image path
        }

        // Load the images
        const overlayImagePath = path.join(__dirname, '../public/cardOverlay.png');
        const dirtyOverlayPath = path.join(__dirname, '../public/dirtyOverlay.png');
        const profileImage = await loadImage(finalProfileImagePath);
        const overlayImage = await loadImage(overlayImagePath);
        const dirtyOverlay = await loadImage(dirtyOverlayPath);

        // Load the selected stamp or default to blank.png if none selected
        const stampFile = stamp.endsWith('.png') ? stamp : `${stamp}.png`;
        const stampImagePath = path.join(__dirname, `../public/${stampFile}`);
        const stampImage = await loadImage(stampImagePath);

        // Create the canvas
        const canvas = createCanvas(820, 517);
        const ctx = canvas.getContext('2d');

        // Set padding and offset
        const padding = 30;
        const leftOffset = 10;
        const usableWidth = canvas.width - 2 * padding;
        const usableHeight = canvas.height - 2 * padding;

        // Fill background with the selected color and rounded corners
        ctx.fillStyle = backgroundColor;
        drawRoundedRect(ctx, padding, padding, usableWidth, usableHeight, 30); // Rounded corners
        ctx.fill();

        // Apply the dirty overlay with transparency to the background
        ctx.save();
        ctx.globalAlpha = 0.9;
        drawRoundedRect(ctx, padding, padding, usableWidth, usableHeight, 30);
        ctx.clip();
        ctx.drawImage(dirtyOverlay, padding, padding, usableWidth, usableHeight);
        ctx.restore();

        // Draw the profile image with slight tilt and shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        const profileCenterX = 225 + leftOffset;
        const profileCenterY = 250;
        const profileImageWidth = 300;
        const profileImageHeight = 300;
        const angle = -0.06;
        ctx.translate(profileCenterX, profileCenterY);
        ctx.rotate(angle);
        ctx.drawImage(profileImage, -profileImageWidth / 2, -profileImageHeight / 2, profileImageWidth, profileImageHeight);
        ctx.restore();

        // Apply grain effect to profile area
        const imageData = ctx.getImageData(profileCenterX - profileImageWidth / 2, profileCenterY - profileImageHeight / 2, profileImageWidth, profileImageHeight);
        const grainImageData = applyGrainEffect(imageData, 15);
        ctx.putImageData(grainImageData, profileCenterX - profileImageWidth / 2, profileCenterY - profileImageHeight / 2);

        // Draw the text elements
        ctx.fillStyle = '#000';
        ctx.font = '20px RockSaltRegular';
        ctx.fillText(`${issuedTo}`, padding + 460, padding + 115);
        ctx.fillText(`${dob}`, padding + 480, padding + 140);
        ctx.fillText(`${placeOfIssue}`, padding + 480, padding + 170);
        ctx.fillText(`${dateOfIssue}`, padding + 480, padding + 200);

        // Signature font handling
        if (signature && signature.trim() !== "") {
            const selectedFont = fontSelect || 'RockSaltRegular';
            switch (selectedFont) {
                case 'PizzaismyFAVORITE':
                    ctx.font = `50px ${selectedFont}`;
                    break;
                case 'circhand':
                    ctx.font = `80px ${selectedFont}`;
                    break;
                case 'Domestic_Manners':
                    ctx.font = `50px ${selectedFont}`;
                    break;
                case 'FontForErin':
                    ctx.font = `55px ${selectedFont}`;
                    break;
                case 'irrep':
                    ctx.font = `58px ${selectedFont}`;
                    break;
                case 'Scrawler':
                    ctx.font = `85px ${selectedFont}`;
                    break;
                case 'Snake':
                    ctx.font = `60px ${selectedFont}`;
                    break;
                case 'UglyDaveAlternates':
                    ctx.font = `55px ${selectedFont}`;
                    break;
                case 'VtksGarotaBonita':
                    ctx.font = `55px ${selectedFont}`;
                    break;
                case 'Zeyada':
                    ctx.font = `56px ${selectedFont}`;
                    break;
                case 'rans':
                    ctx.font = `50px ${selectedFont}`;
                    break;
                default:
                    ctx.font = `35px ${selectedFont}`;
                    break;
            }
            ctx.fillText(signature, padding + 450, padding + 390);
        }

        // Draw the stamp image
        ctx.save();
        ctx.globalAlpha = 0.7;
        let stampPositionX = 400; 
        let stampPositionY = 160;
        let stampWidth = 350;
        let stampHeight = 350;
        if(stamp === 'callMeIfYouGetLostStamp'){ 
            stampPositionX = 400; 
            stampPositionY = 140;
            stampWidth = 350;
            stampHeight = 350;
       }
   
       if(stamp === 'xoStamp'){ 
           stampPositionX = 450; 
           stampPositionY = 190;
           stampWidth = 270;
           stampHeight = 270;
           
      }
   
       if(stamp === 'spacemanStamp'){ 
           stampPositionX = 470; 
           stampPositionY = 220;
           stampWidth = 230;
           stampHeight = 230;
      }
   
       if(stamp === 'DeceasedStamp'){ 
           stampPositionX = 400; 
           stampPositionY = 140;
           stampWidth = 350;
           stampHeight = 350;
      }
   
       if(stamp === 'PinkTapeStamp'){ 
           stampPositionX = 420; 
           stampPositionY = 160;
           stampWidth = 325;
           stampHeight = 325;
      }
   
   
      if (stamp === 'lsStamp') {
           stampWidth = 275; // Custom width for japanStamp
           stampHeight = 275; // Custom height for japanStamp
           stampPositionX =  440; // Position it above the signature, near the bottom right
           stampPositionY = 200;
       }
   
      if (stamp === 'neverHomeStamp') {
           stampPositionX = 420; 
           stampPositionY = 170;
           stampWidth = 300;
           stampHeight = 300;
       }
   
       if (stamp === 'japanStamp') {
           stampWidth = 200; // Custom width for japanStamp
           stampHeight = 200; // Custom height for japanStamp
            stampPositionX =  470; // Position it above the signature, near the bottom right
            stampPositionY = 220;
       }
   
       if (stamp === 'NasaStamp') {
            stampPositionX = 420; 
            stampPositionY = 190;
            stampWidth = 300;
            stampHeight = 300;
       }
   
       if (stamp === 'ApolloStamp') {
           stampPositionX = 460; 
           stampPositionY = 170;
           stampWidth = 300;
           stampHeight = 300;
      }
   
      if(stamp =='andromeda') { 
           stampPositionX = 450; 
           stampPositionY = 210;
           stampWidth = 225;
           stampHeight = 225;
      }

        ctx.drawImage(stampImage, stampPositionX, stampPositionY, stampHeight, stampWidth);
        ctx.restore();

        // Draw the card overlay image on top
        ctx.globalAlpha = 1;
        ctx.drawImage(overlayImage, padding - leftOffset, padding, usableWidth + leftOffset, usableHeight);

        // Save the generated image
        const generatedDir = path.join(__dirname, '../public/generated');
        if (!fs.existsSync(generatedDir)) {
            fs.mkdirSync(generatedDir, { recursive: true });
        }
        const generatedImagePath = path.join(generatedDir, `${Date.now()}.png`);
        const out = fs.createWriteStream(generatedImagePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        return new Promise((resolve, reject) => {
            out.on('finish', () => resolve(generatedImagePath));
            out.on('error', reject);
        });
    } catch (error) {
        console.error('Error generating license:', error);
        throw new Error("Unsupported image type. Please upload a JPG or PNG.");
    } finally {
        // Clean up the converted image file if it was created
        if (convertedImagePath && fs.existsSync(convertedImagePath)) {
            fs.unlinkSync(convertedImagePath);
        }
    }
}





// Helper function to draw rounded rectangles
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

module.exports = {
    generateLicense
};
