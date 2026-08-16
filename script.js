/* ============================================
   HTML ELEMENTS
============================================ */

const trackModal = document.getElementById("trackModal");

const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalDiscImage");

const modalTitle = document.getElementById("modalDiscTitle");

const modalSubtitle = document.getElementById("modalDiscSubtitle");

const modalCount = document.getElementById("modalTrackCount");

const modalTracks = document.getElementById("modalTracks");

/* ============================================
   PROOF ALBUM DATA
============================================ */

const proofDiscs = {
  disc1: {
    image: "./imgs/CD1.jpg",
    title: "DISC I",
    subtitle: "Main Chapters",
    folder: "CD1",
    tracks: [
      {
        title: "Born Singer",
        file: "01. Born Singer.mp3",
      },
      {
        title: "No More Dream",
        file: "02. No More Dream.mp3",
      },
      {
        title: "N.O",
        file: "03. N.O.mp3",
      },
      {
        title: "Boy In Luv",
        file: "04. Boy In Luv.mp3",
      },
      {
        title: "Danger",
        file: "05. Danger.mp3",
      },
      {
        title: "I NEED U",
        file: "06. I NEED U.mp3",
      },
      {
        title: "RUN",
        file: "07. RUN.mp3",
      },
      {
        title: "FIRE",
        file: "08. FIRE.mp3",
      },
      {
        title: "Blood Sweat & Tears",
        file: "09. Blood Sweat & Tears.mp3",
      },
      {
        title: "Spring Day",
        file: "10. Spring Day.mp3",
      },
      {
        title: "DNA",
        file: "11. DNA.mp3",
      },
      {
        title: "FAKE LOVE",
        file: "12. FAKE LOVE.mp3",
      },
      {
        title: "IDOL",
        file: "13. IDOL.mp3",
      },
      {
        title: "Boy With Luv (feat. Halsey)",
        file: "14. Boy With Luv (feat. Halsey).mp3",
      },
      {
        title: "ON",
        file: "15. ON.mp3",
      },
      {
        title: "Dynamite",
        file: "16. Dynamite.mp3",
      },
      {
        title: "Life Goes On",
        file: "17. Life Goes On.mp3",
      },
      {
        title: "Butter",
        file: "18. Butter.mp3",
      },
      {
        title: "Yet To Come (The Most Beautiful Moment)",
        file: "19. Yet To Come.mp3",
      },
    ],
  },
  disc2: {
    image: "./imgs-proof/disc2.png",
    title: "DISC II",
    subtitle: "Solo & Unit Tracks",
    folder: "CD2",
    tracks: [
      { title: "Run BTS", file: "01. Run BTS.mp3" },
      { title: "Intro : Persona", file: "02. Intro - Persona.mp3" },
      { title: "Stay", file: "03. Stay.mp3" },
      { title: "Moon", file: "04. Moon.mp3" },
      { title: "Jamais Vu", file: "05. Jamais Vu.mp3" },
      { title: "Trivia 轉 : Seesaw", file: "06. Trivia - Seesaw.mp3" },
      { title: "BTS Cypher Pt.3 : KILLER", file: "07. Cypher Pt.3 - KILLER.mp3" },
      { title: "Outro : Ego", file: "08. Outro - Ego.mp3" },
      { title: "Her", file: "09. Her.mp3" },
      { title: "Filter", file: "10. Filter.mp3" },
      { title: "Friends", file: "11. Friends.mp3" },
      { title: "Singularity", file: "12. Singularity.mp3" },
      { title: "00:00 (Zero O'Clock)", file: "13. 00:00 - Zero O'Clock.mp3" },
      { title: "Euphoria", file: "14. Euphoria.mp3" },
      { title: "Dimple", file: "15. Dimple.mp3" },
    ],
  },
  disc3: {
    image: "./imgs-proof/disc3.png",
    title: "DISC III",
    subtitle: "Demo & Special Tracks",
    folder: "CD3",
    tracks: [
      { title: "Jump (Demo Ver.)", file: "01. Jump - Demo.mp3" },
      { title: "Young Love", file: "02. Young Love.mp3" },
      { title: "Boy In Luv (Demo Ver.)", file: "03. Boy In Luv - Demo.mp3" },
      { title: "Quotation Mark", file: "04. Quotation Mark.mp3" },
      { title: "I NEED U (Demo Ver.)", file: "05. I NEED U - Demo.mp3" },
      { title: "Boyz with Fun (Demo Ver.)", file: "06. Boyz with Fun - Demo.mp3" },
      { title: "Tony Montana (with Jimin)", file: "07. Tony Montana.mp3" },
      { title: "Young Forever (RM Demo Ver.)", file: "08. Young Forever - Demo.mp3" },
      { title: "Spring Day (V Demo Ver.)", file: "09. Spring Day - Demo.mp3" },
      { title: "DNA (j-hope Demo Ver.)", file: "10. DNA - Demo.mp3" },
      { title: "Epiphany (Jin Demo Ver.)", file: "11. Epiphany - Demo.mp3" },
      { title: "Seesaw (Demo Ver.)", file: "12. Seesaw - Demo.mp3" },
      { title: "Still With You (Acapella)", file: "13. Still With You.mp3" },
      { title: "For Youth", file: "14. For Youth.mp3" },
    ],
  },
};

/* ============================================
   LOAD DISC
============================================ */

function loadDisc(disc) {
  const data = proofDiscs[disc];

  trackModal.classList.add("show");

  modalImage.src = data.image;

  modalTitle.textContent = data.title;

  modalSubtitle.textContent = data.subtitle;

  modalCount.textContent = `${data.tracks.length} Tracks`;

  modalTracks.innerHTML = "";

  data.tracks.forEach((track, index) => {
    const trackItem = document.createElement("div");

    trackItem.className = "modal-track";

    trackItem.innerHTML = `
      <span class="track-number">
        ${String(index + 1).padStart(2, "0")}
      </span>
      <h4 class="track-name">
        ${track.title}
      </h4>
      <button class="track-play">
        <i class="fa-solid fa-play"></i>
      </button>
    `;

    modalTracks.appendChild(trackItem);
  });
}

/* ============================================
   CLOSE MODAL
============================================ */

closeModal.addEventListener("click", () => {
  trackModal.classList.remove("show");
});

/* ============================================
   CLOSE WHEN CLICKING BACKGROUND
============================================ */

trackModal.addEventListener("click", (e) => {
  if (e.target === trackModal) {
    trackModal.classList.remove("show");
  }
});