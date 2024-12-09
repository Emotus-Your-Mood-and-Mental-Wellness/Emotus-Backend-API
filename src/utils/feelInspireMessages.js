const happyInspireMessages = [
  "Kebahagiaanmu adalah cerminan dari usaha dan rasa syukurmu. Teruslah berbagi energi positif ini!",
  "Senyummu hari ini adalah bukti kekuatanmu. Teruslah menginspirasi!",
  "Kebahagiaan sejati datang dari hati yang bersyukur. Jadilah cahaya bagi sekitarmu."
];

const sadInspireMessages = [
  "Di balik awan mendung, selalu ada matahari yang menunggu. Kamu akan lebih kuat setelah ini.",
  "Kesedihan adalah guru yang mengajarkan ketahanan. Beri waktu untuk dirimu pulih.",
  "Dalam setiap kesedihan, tersimpan benih kebijaksanaan. Kamu akan tumbuh lebih kuat."
];

const fearInspireMessages = [
  "Ketakutan adalah pintu menuju keberanian. Setiap langkah kecil adalah kemenangan.",
  "Rasa takut adalah tanda bahwa kamu peduli. Jadikan ini bahan bakar untuk maju.",
  "Di balik ketakutan ada kekuatan yang belum kamu sadari. Percayalah pada dirimu."
];

const loveInspireMessages = [
  "Cinta adalah energi yang mengubah dunia. Teruslah berbagi kebaikan ini.",
  "Hati yang penuh cinta adalah sumber kekuatan. Bagikan kehangatan ini.",
  "Cinta adalah bahasa universal yang menyembuhkan. Tebarkan kasih sayangmu."
];

const angerInspireMessages = [
  "Amarah bisa menjadi kekuatan untuk perubahan positif. Arahkan dengan bijak.",
  "Di balik kemarahan ada kepedulian yang dalam. Ubah menjadi tindakan positif.",
  "Kemarahan adalah energi yang bisa diubah menjadi motivasi. Kamu bisa melakukannya."
];

function getRandomFeelInspire(mood) {
  const messageMap = {
    'Happy': happyInspireMessages,
    'Sadness': sadInspireMessages,
    'Fear': fearInspireMessages,
    'Love': loveInspireMessages,
    'Anger': angerInspireMessages
  };

  const messages = messageMap[mood] || happyInspireMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = {
  getRandomFeelInspire
};