const GET_LIST_URL = "http://127.0.0.1:5000/getlist";
const POST_LIST_URL = "http://127.0.0.1:5000/postlist";

// Fruit emojis for fun!
const fruitEmojis = [
  "🍎", "🍌", "🍒", "🍇", "🍉", "🍊", "🍍", "🥝", "🍓", "🥭", "🍑", "🍈"
];

// Helper to pick a random emoji
function getRandomEmoji() {
  return fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
}

// Animate fruit in
function animateIn(li) {
  li.style.transform = "translateX(100vw) scale(0.7) rotateY(60deg)";
  li.style.opacity = "0";
  setTimeout(() => {
    li.style.transition = "all 0.7s cubic-bezier(.68,-0.55,.27,1.55)";
    li.style.transform = "translateX(0) scale(1) rotateY(0deg)";
    li.style.opacity = "1";
  }, 10);
}

// Animate fruit out
function animateOut(li, callback) {
  li.style.transition = "all 0.5s cubic-bezier(.68,-0.55,.27,1.55)";
  li.style.transform = "translateX(-100vw) scale(0.5) rotateZ(-90deg)";
  li.style.opacity = "0";
  setTimeout(callback, 500);
}

// Load fruits from backend and display in HTML
async function loadFruits() {
  const res = await fetch(GET_LIST_URL);
  const data = await res.json();

  const list = document.getElementById("fruit_list");
  list.innerHTML = ""; // Clear existing list

  for (const id in data) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="fruit-emoji">${getRandomEmoji()}</span> <span class="fruit-name">${data[id]}</span>`;
    li.classList.add("fruit-3d");
    animateIn(li);

    // Click to "throw away" (remove visually)
    li.addEventListener("click", () => {
      animateOut(li, () => li.remove());
    });

    // 3D pop on hover
    li.addEventListener("mouseenter", () => {
      li.style.transform += " scale(1.12) rotateY(10deg)";
      li.style.boxShadow = "0 8px 24px 0 rgba(255,183,77,0.25)";
    });
    li.addEventListener("mouseleave", () => {
      li.style.transform = "translateX(0) scale(1) rotateY(0deg)";
      li.style.boxShadow = "";
    });

    list.appendChild(li);
  }
}

// Add new fruit using POST request
async function addFruit() {
  const input = document.getElementById("fruitInput");
  const value = input.value.trim();

  if (!value) {
    alert("Please enter a fruit");
    return;
  }

  await fetch(POST_LIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ item: value })
  });

  input.value = ""; // Clear input box
  loadFruits();     // Refresh the fruit list
}

// Load fruits on page load
window.onload = loadFruits;

// Expose addFruit globally for the button
window.addFruit = addFruit;