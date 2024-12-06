const happyInspireMessages = [
    "Kebahagiaanmu adalah cerminan dari usaha dan cara kamu melihat dunia. Ingat, kebahagiaan bukan hanya tentang apa yang kita miliki, tetapi tentang bagaimana kita mensyukuri setiap momen yang ada. Semakin kita berbagi kebaikan dan energi positif, semakin besar kebahagiaan itu tumbuh dalam diri kita dan orang lain.",
    "Senyummu hari ini adalah bukti bahwa kamu telah berhasil melewati berbagai tantangan. Teruslah memancarkan energi positif ini, karena kebahagiaanmu bisa menjadi inspirasi bagi orang lain untuk tetap optimis dalam menjalani hidup.",
    "Kebahagiaan sejati datang dari hati yang penuh syukur. Setiap langkah positif yang kamu ambil hari ini adalah investasi untuk kebahagiaan di masa depan. Jadilah cahaya yang menerangi hari orang lain dengan ketulusan dan kehangatan hatimu."
  ];
  
  const sadInspireMessages = [
    "Di balik awan mendung, selalu ada matahari yang menunggu untuk bersinar. Kesedihan yang kamu rasakan saat ini adalah bagian dari perjalanan yang akan membuatmu lebih kuat. Percayalah, setiap air mata yang jatuh akan membuat hatimu lebih bijak dalam memahami makna hidup.",
    "Kesedihan adalah guru yang mengajarkan kita tentang kekuatan dan ketahanan. Beri dirimu waktu untuk merasakan, tapi ingat bahwa kamu memiliki kekuatan untuk bangkit kembali. Setiap hari adalah kesempatan baru untuk memulai lembaran yang lebih cerah.",
    "Dalam setiap kesedihan, tersimpan benih kebijaksanaan dan pertumbuhan. Jadikan momen ini sebagai kesempatan untuk mengenal dirimu lebih dalam dan menemukan kekuatan yang mungkin belum kamu sadari sebelumnya."
  ];
  
  const fearInspireMessages = [
    "Ketakutan adalah pintu menuju keberanian. Setiap kali kamu menghadapi rasa takut, kamu sedang membangun fondasi untuk menjadi versi dirimu yang lebih kuat. Ingat, keberanian bukan berarti tidak memiliki rasa takut, tapi tetap melangkah meski takut itu ada.",
    "Rasa takut yang kamu rasakan adalah tanda bahwa kamu peduli dan berani bermimpi besar. Jadikan ketakutan ini sebagai bahan bakar untuk bertumbuh dan berkembang. Setiap langkah kecil menghadapi ketakutan adalah kemenangan besar untuk dirimu.",
    "Di balik setiap ketakutan, ada kesempatan untuk menemukan kekuatan yang belum kamu ketahui. Percayalah pada prosesmu, karena setiap tantangan yang kamu hadapi hari ini sedang mempersiapkanmu untuk hal-hal besar di masa depan."
  ];
  
  const loveInspireMessages = [
    "Cinta yang kamu rasakan adalah energi transformatif yang bisa mengubah dunia menjadi tempat yang lebih baik. Teruslah berbagi kasih sayang ini, karena setiap tindakan kecil penuh cinta bisa menciptakan efek riak yang luar biasa dalam kehidupan orang lain.",
    "Hati yang dipenuhi cinta adalah sumber kekuatan yang tak terbatas. Gunakan energi positif ini untuk menginspirasi dan mengangkat semangat orang di sekitarmu. Ingat, cinta sejati selalu bermula dari mencintai dan menghargai diri sendiri.",
    "Cinta adalah bahasa universal yang bisa menyembuhkan dan menguatkan. Jadilah pembawa cinta dalam setiap langkahmu, karena dunia selalu membutuhkan lebih banyak kasih sayang dan pengertian."
  ];
  
  const angerInspireMessages = [
    "Amarah yang kamu rasakan adalah energi yang bisa diubah menjadi kekuatan untuk perubahan positif. Gunakan momen ini untuk memahami dirimu lebih dalam dan menemukan solusi yang konstruktif. Setiap tantangan adalah kesempatan untuk bertumbuh lebih bijak.",
    "Di balik kemarahan, sering kali tersembunyi kepedulian yang mendalam. Jadikan emosi ini sebagai pendorong untuk menciptakan perubahan yang berarti. Ingat, cara kita mengelola amarah menentukan kualitas hubungan kita dengan diri sendiri dan orang lain.",
    "Kemarahan bisa menjadi katalis untuk transformasi positif. Ambil waktu untuk menenangkan diri dan pikirkan bagaimana energi ini bisa diarahkan untuk menciptakan solusi yang membangun, bukan menghancurkan."
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