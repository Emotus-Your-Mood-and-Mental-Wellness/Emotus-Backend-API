const happyHints = [
  "Bagikan energi positifmu hari ini. Dokumentasikan momen bahagia ini!",
  "Gunakan mood positif ini untuk mewujudkan impianmu!",
  "Luangkan waktu untuk mensyukuri hal-hal kecil hari ini.",
  "Mood positifmu adalah berkah. Gunakan untuk memotivasi diri!"
];

const sadHints = [
  "Ambil waktu sejenak untuk diri sendiri. Dengarkan musik yang menenangkan.",
  "Kesedihan adalah emosi yang wajar. Lakukan hal kecil yang menghibur.",
  "Fokus pada hal-hal yang bisa kamu kontrol. Beri diri kasih sayang.",
  "Kesedihan akan berlalu. Ada banyak orang yang peduli padamu."
];

const fearHints = [
  "Fokus pada hal yang bisa kamu kontrol. Ambil napas dalam-dalam.",
  "Ketakutan adalah sinyal. Hadapi secara bertahap.",
  "Kamu lebih kuat dari ketakutanmu. Fokus pada saat ini.",
  "Setiap langkah menghadapi ketakutan adalah kemenangan."
];

const loveHints = [
  "Ekspresikan rasa sayangmu dengan tindakan kecil hari ini.",
  "Bagikan kehangatan pada orang di sekitarmu.",
  "Cinta dimulai dari mencintai diri sendiri.",
  "Tunjukkan apresiasi pada orang yang kamu sayangi."
];

const angerHints = [
  "Ambil jeda sejenak. Tarik napas dalam sebelum bertindak.",
  "Identifikasi akar kemarahan. Cari solusi positif.",
  "Salurkan energi ini ke aktivitas produktif.",
  "Kamu lebih besar dari amarahmu. Tenangkan diri dulu."
];

function getRandomHint(mood) {
  const hintMap = {
    'Happy': happyHints,
    'Sadness': sadHints,
    'Fear': fearHints,
    'Love': loveHints,
    'Anger': angerHints
  };

  const hints = hintMap[mood] || happyHints;
  return hints[Math.floor(Math.random() * hints.length)];
}

module.exports = {
  getRandomHint
};