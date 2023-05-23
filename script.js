const cards = document.querySelectorAll(".card"),
  timeTag = document.querySelector(".time b"),
  refreshBtn = document.querySelector("#refreshBtn");

let maxTime = 30;
let timeLeft = maxTime;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let selectedSkin = "1"; // Default skin

const backgroundMusic = document.querySelector("#backgroundMusic");
const musicToggleBtn = document.querySelector("#musicToggleBtn");
const musicOnIcon = document.querySelector("#musicOnIcon");
const musicOffIcon = document.querySelector("#musicOffIcon");

const changeSkinBtn = document.querySelector("#changeSkinBtn");

let isMusicPlaying = false;

// Check if the music state is stored in localStorage
if (localStorage.getItem("isMusicPlaying") === "true") {
  playMusic();
} else {
  pauseMusic();
}

musicToggleBtn.addEventListener("click", toggleMusic);

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  backgroundMusic.play();
  backgroundMusic.volume = 0.1; // Set volume to 50%
  musicOnIcon.style.display = "inline";
  musicOffIcon.style.display = "none";
  isMusicPlaying = true;
  localStorage.setItem("isMusicPlaying", "true"); // Store the state in localStorage
}

function pauseMusic() {
  backgroundMusic.pause();
  musicOnIcon.style.display = "none";
  musicOffIcon.style.display = "inline";
  isMusicPlaying = false;
  localStorage.setItem("isMusicPlaying", "false"); // Store the state in localStorage
}

function initTimer() {
  if (timeLeft <= 0) {
    return clearInterval(timer);
    // Add code to handle when the timer reaches 0
  } else {
    timeLeft--;
    timeTag.innerText = timeLeft;
  }
}

function updateCardSkins(skin) {
  const cardBackImgPaths = [];
  const cardFrontImgPath = `images/skin${skin}/front.png`;
  for (let i = 1; i <= 6; i++) {
    cardBackImgPaths.push(`images/skin${skin}/back${i}.png`);
  }

  cards.forEach((card, index) => {
    const backViewImg = card.querySelector(".back-view img");
    backViewImg.src = cardBackImgPaths[index];

    const frontViewImg = card.querySelector(".front-view img");
    frontViewImg.src = cardFrontImgPath;
  });
}

// Event listener for the change skin button
changeSkinBtn.addEventListener("click", () => {
  skinDropdown.classList.toggle("show");
});

// Event listener for the skin options
skinDropdown.querySelectorAll("a").forEach((option) => {
  option.addEventListener("click", handleSkinSelection);
});

function handleSkinSelection(event) {
  event.preventDefault();
  selectedSkin = event.target.getAttribute("data-skin");
  updateCardSkins(selectedSkin);
  updateColors(selectedSkin); // Add this line to update the colors based on the selected skin

  // Refresh the timer
  shuffleCard();

  // Close the dropdown menu
  skinDropdown.classList.remove("show");
}

function updateColors(selectedSkin) {
  const body = document.querySelector("body");

  if (selectedSkin === "1") {
    body.style.background = "#52b788";
    // Update other color styles for skin 1 here
    document.styleSheets[0].addRule(
      "::selection",
      "color: #fff; background: #52b788"
    );
    document
      .querySelectorAll(".details button:not(#musicToggleBtn)")
      .forEach((button) => {
        button.style.color = "#52b788";
        button.style.background = "#fff";
        button.style.border = "2px solid #52b788";
        button.addEventListener("mouseover", () => {
          button.style.color = "#fff";
          button.style.background = "#52b788";
        });
        button.addEventListener("mouseout", () => {
          button.style.color = "#52b788";
          button.style.background = "#fff";
        });
      });
  } else if (selectedSkin === "2") {
    body.style.background = "#0466c8";
    // Update other color styles for skin 2 here
    document.styleSheets[0].addRule(
      "::selection",
      "color: #fff; background: #0466c8"
    );
    document
      .querySelectorAll(".details button:not(#musicToggleBtn)")
      .forEach((button) => {
        button.style.color = "#0466c8";
        button.style.background = "#fff";
        button.style.border = "2px solid #0466c8";
        button.addEventListener("mouseover", () => {
          button.style.color = "#fff";
          button.style.background = "#0466c8";
        });
        button.addEventListener("mouseout", () => {
          button.style.color = "#0466c8";
          button.style.background = "#fff";
        });
      });
  } else if (selectedSkin === "3") {
    body.style.background = "#ffc300";
    // Update other color styles for skin 3 here
    document.styleSheets[0].addRule(
      "::selection",
      "color: #fff; background: #ffc300"
    );
    document
      .querySelectorAll(".details button:not(#musicToggleBtn)")
      .forEach((button) => {
        button.style.color = "#ffc300";
        button.style.background = "#fff";
        button.style.border = "2px solid #ffc300";
        button.addEventListener("mouseover", () => {
          button.style.color = "#fff";
          button.style.background = "#ffc300";
        });
        button.addEventListener("mouseout", () => {
          button.style.color = "#ffc300";
          button.style.background = "#fff";
        });
      });
  }
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard == 6 && timeLeft > 0) {
      return clearInterval(timer);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  timeLeft = maxTime;
  matchedCard = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  disableDeck = isPlaying = false;

  updateCardSkins(selectedSkin); // Apply the selected skin

  let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    setTimeout(() => {
      imgTag.src = `images/skin${selectedSkin}/back${arr[index]}.png`;
      card.addEventListener("click", flipCard);
    }, 500);
  });
}

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

pauseMusic(); // Pause by default

updateColors(selectedSkin);
