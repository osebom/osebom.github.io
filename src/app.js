const monthEl = document.getElementById("current-month");
const dayEl = document.getElementById("current-day");
const secondsEl = document.getElementById("wc-seconds");

function getOrdinalSuffix(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "st";
  if (mod10 === 2 && mod100 !== 12) return "nd";
  if (mod10 === 3 && mod100 !== 13) return "rd";
  return "th";
}

function formatDay(date) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const day = date.getDate();
  return {
    month: months[date.getMonth()],
    day: `${day}${getOrdinalSuffix(day)}`,
  };
}

function getWorldCupTarget(now) {
  const year = now.getFullYear();
  let target = new Date(year, 5, 11, 15, 0, 0);
  if (now > target) {
    target = new Date(year + 1, 5, 11, 15, 0, 0);
  }
  return target;
}

function updateCountdown() {
  const now = new Date();
  const formatted = formatDay(now);
  if (monthEl) monthEl.textContent = formatted.month;
  if (dayEl) dayEl.textContent = formatted.day;
  if (!secondsEl) return;

  const target = getWorldCupTarget(now);
  const diffMs = Math.max(0, target - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  secondsEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Movie picker widget: one row, background + glass on whole widget
const moviePickerWidget = document.getElementById("movie-picker-widget");
const moviePickerGrid = document.getElementById("movie-picker-grid");

const moviePickerTitleEl = document.getElementById("movie-picker-title");
const moviePickerSynopsisEl = document.getElementById("movie-picker-synopsis");

if (moviePickerWidget && moviePickerGrid) {
  const posters = Array.from(moviePickerGrid.querySelectorAll(".movie-picker-poster"));

  function setPosterBackgrounds() {
    posters.forEach((btn) => {
      const src = btn.getAttribute("data-src");
      if (src) btn.style.backgroundImage = `url(${src})`;
    });
  }

  function setWidgetBackground(src) {
    moviePickerWidget.style.backgroundImage = src ? `url(${src})` : "";
  }

  function setTitle(title, year) {
    if (moviePickerTitleEl) {
      const text = year ? `${title || ""} (${year})` : (title || "");
      moviePickerTitleEl.textContent = text;
    }
  }

  function setSynopsis(synopsis) {
    if (moviePickerSynopsisEl) moviePickerSynopsisEl.textContent = synopsis || "";
  }

  function selectPoster(index) {
    const selected = posters[index];
    if (!selected) return;
    posters.forEach((p) => p.classList.remove("selected"));
    selected.classList.add("selected");
    setWidgetBackground(selected.getAttribute("data-src"));
    setTitle(selected.getAttribute("data-title"), selected.getAttribute("data-year"));
    setSynopsis(selected.getAttribute("data-synopsis"));
  }

  posters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"), 10);
      if (!Number.isNaN(index)) selectPoster(index);
    });
  });

  setPosterBackgrounds();
  selectPoster(0);
}

// iPod widget: next track switches song and blurred background
const ipodScreenBg = document.getElementById("ipod-screen-bg");
const ipodAlbum = document.getElementById("ipod-album");
const ipodSong = document.getElementById("ipod-song");
const ipodArtist = document.getElementById("ipod-artist");
const ipodNextBtn = document.querySelector(".ipod-wheel-next");
const ipodPrevBtn = document.querySelector(".ipod-wheel-prev");

const ipodTracks = [
  { title: "I Just Might", artist: "Bruno Mars", image: "src/images/bruno.jpeg" },
  { title: "Drucula", artist: "Tame Impala", image: "src/images/dracula.jpg" },
  { title: "Kese", artist: "Wizkid", image: "src/images/kese.jpeg" },
  { title: "PITY THIS BOY", artist: "ODUMODUBLVCK", image: "src/images/pitythisboy.jpeg" },
  { title: "F1", artist: "Hans Zimmer", image: "src/images/f1.jpeg" },
  { title: "Another Day in Paradise", artist: "Phil Collins", image: "src/images/phillcolins.jpeg" },
];

if (ipodScreenBg && ipodAlbum && ipodSong && ipodArtist && ipodNextBtn) {
  let ipodTrackIndex = 0;

  function setIpodTrack(index) {
    ipodTrackIndex = index % ipodTracks.length;
    if (ipodTrackIndex < 0) ipodTrackIndex += ipodTracks.length;
    const t = ipodTracks[ipodTrackIndex];
    const imgUrl = t.image ? `url(${t.image})` : "";
    ipodScreenBg.style.backgroundImage = imgUrl;
    ipodAlbum.style.backgroundImage = imgUrl;
    ipodSong.textContent = t.title;
    ipodArtist.textContent = t.artist;
  }

  ipodNextBtn.addEventListener("click", () => {
    setIpodTrack(ipodTrackIndex + 1);
  });

  if (ipodPrevBtn) {
    ipodPrevBtn.addEventListener("click", () => {
      setIpodTrack(ipodTrackIndex - 1);
    });
  }

  setIpodTrack(0);
}
