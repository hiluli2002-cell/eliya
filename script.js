// ==========================================
// חלק 1: שינוי צבע רקע, נגינת מוזיקה והוספת תמונות בלחיצה
// ==========================================
const candyPlate = document.getElementById('candy-plate');
const icedCoffeeBtn = document.getElementById('iced-coffee');
const container = document.getElementById('chaos-container');

const colors = ['red', 'blue', 'yellow', 'green'];
const soundFiles = ['1-04 sound.mp3.mp3', 'sound2.mp3', 'sound3.mp3'];
const gifFiles = ['img1.gif', 'img2.gif', 'img3.gif', 'img4.gif', 'img5.gif', 'img6.gif', 'img7.gif', 'img8.gif', 'img9.gif', 'img10.gif'];

let currentAudio = null;
let clickCounter = 0; // מונה לחיצות חדש כדי לעקוב אחרי הלחיצות

// פונקציה שמנגנת סאונד אקראי חדש
function playRandomSound() {
  // עצירת השיר הקודם במידה והוא קיים
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  // בחירת סאונד אקראי ונגינתו
  const randomSound = soundFiles[Math.floor(Math.random() * soundFiles.length)];
  currentAudio = new Audio(randomSound);
  currentAudio.play().catch(err => console.log("אודיו נחסם עקב הגדרות דפדפן:", err));
}

// פונקציה שבודקת כמה תמונות יש ומציגה/מחביאה את הקפה הקר
function checkImageCount() {
  const currentImages = document.querySelectorAll('.image-div');
  if (currentImages.length > 30) {
    icedCoffeeBtn.style.display = 'block';
  } else {
    icedCoffeeBtn.style.display = 'none';
  }
}

candyPlate.addEventListener('click', () => {
  clickCounter++; // מעלים את מונה הלחיצות ב-1 בכל לחיצה

  // א. שינוי צבע אקראי מתוך המערך בכל לחיצה
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = randomColor;

  // ב. נגינת מוזיקה: בלחיצה הראשונה, או בכל לחיצה חמישית (5, 10, 15...)
  if (clickCounter === 1 || clickCounter % 5 === 0) {
    playRandomSound();
  }

  // ג. הוספת תמונה חדשה בכל לחיצה
  createRandomImage();
  
  // ד. בדיקה אם הגענו ליותר מ-30 תמונות
  checkImageCount();
});

// ==========================================
// חלק 2: הוספת תמונות (נקרא רק בלחיצה כעת)
// ==========================================
function createRandomImage() {
  const newDiv = document.createElement('div');
  newDiv.className = 'image-div';
  
  newDiv.style.top = Math.random() * 80 + '%';
  newDiv.style.left = Math.random() * 90 + '%';
  newDiv.style.animationDuration = (Math.random() * 10 + 5) + 's';

  const newImg = document.createElement('img');
  newImg.className = 'character';
  newImg.src = gifFiles[Math.floor(Math.random() * gifFiles.length)];

  newDiv.appendChild(newImg);
  container.appendChild(newDiv);
}

// ==========================================
// חלק 2.5: לחיצה על הקפה הקר למחיקת התמונות ואיפוס המונה
// ==========================================
icedCoffeeBtn.addEventListener('click', () => {
  container.innerHTML = ''; // מרוקן את כל התמונות
  clickCounter = 0; // מאפס את מונה הלחיצות למקרה שתרצי לספור מחדש מ-0
  checkImageCount(); // מחביא את הקפה הקר
});

// ==========================================
// חלק 3: בריחת תמונות מהעכבר + שובל נצנצים
// ==========================================
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const images = document.querySelectorAll('.image-div');
  const radius = 200;
  
  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    const imgX = rect.left + rect.width / 2;
    const imgY = rect.top + rect.height / 2;
    
    const distanceX = imgX - mouseX;
    const distanceY = imgY - mouseY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance < radius) {
      const force = (radius - distance) / radius;
      const pushStrength = force * 150;
      
      const dirX = distance === 0 ? 1 : distanceX / distance;
      const dirY = distance === 0 ? 1 : distanceY / distance;
      
      const moveX = dirX * pushStrength;
      const moveY = dirY * pushStrength;
      
      img.style.setProperty('--mouse-x', `${moveX}px`);
      img.style.setProperty('--mouse-y', `${moveY}px`);
    } else {
      img.style.setProperty('--mouse-x', '0px');
      img.style.setProperty('--mouse-y', '0px');
    }
  });

  createSparkle(mouseX, mouseY);
});

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  
  const sparklesTypes = ['✨', '⭐', '💫', '🌟'];
  sparkle.textContent = sparklesTypes[Math.floor(Math.random() * sparklesTypes.length)];
  
  sparkle.style.left = (x - 10) + 'px';
  sparkle.style.top = (y - 15) + 'px';
  sparkle.style.fontSize = (Math.random() * 15 + 15) + 'px';
  
  const moveX = (Math.random() - 0.5) * 100 + 'px';
  const moveY = (Math.random() * 50 + 50) + 'px';
  
  sparkle.style.setProperty('--move-x', moveX);
  sparkle.style.setProperty('--move-y', moveY);
  
  document.body.appendChild(sparkle);
  
  setTimeout(() => {
    sparkle.remove();
  }, 800);
}