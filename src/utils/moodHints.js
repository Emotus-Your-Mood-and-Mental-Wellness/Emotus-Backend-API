const happyHints = [
    "Saat kamu bahagia, bagikan energi positifmu dengan orang lain. Kebahagiaan yang dibagi bisa menginspirasi dan menular ke sekitarmu. Ingat untuk mendokumentasikan momen bahagia ini sebagai pengingat di hari-hari mendatang!",
    "Manfaatkan mood positif ini untuk melakukan hal-hal yang sudah lama kamu rencanakan. Energi positif bisa menjadi bahan bakar terbaik untuk mewujudkan impianmu!",
    "Kebahagiaan adalah hadiah berharga. Luangkan waktu untuk mensyukuri hal-hal kecil yang membuatmu bahagia hari ini. Buat jurnal kebahagiaan untuk mengingat momen-momen indah ini.",
    "Mood positifmu hari ini adalah berkah. Gunakan energi ini untuk memotivasi dirimu mencapai tujuan dan impianmu. Ingat, kebahagiaan sejati datang dari berbagi dengan sesama."
  ];
  
  const sadHints = [
    "Saat kamu merasa sedih, cobalah untuk mengambil waktu sejenak untuk diri sendiri. Cobalah teknik pernapasan dalam atau dengarkan musik yang menenangkan. Kadang, berbicara dengan teman atau keluarga bisa membantu meringankan perasaanmu. Ingat, perasaan ini tidak permanen!",
    "Kesedihan adalah emosi yang wajar dan manusiawi. Beri dirimu izin untuk merasakan, tapi jangan lupa untuk melakukan hal-hal kecil yang bisa menghiburmu. Mungkin secangkir teh hangat atau film favoritmu bisa membantu.",
    "Di balik awan mendung, matahari masih tetap bersinar. Sama seperti kesedihanmu saat ini, ini hanyalah fase yang akan berlalu. Fokus pada hal-hal yang bisa kamu kontrol dan beri dirimu kasih sayang yang kamu butuhkan.",
    "Kesedihan bisa menjadi guru yang baik. Gunakan momen ini untuk introspeksi dan mengenal dirimu lebih dalam. Jangan lupa, ada banyak orang yang peduli dan siap mendukungmu."
  ];
  
  const fearHints = [
    "Rasa takut adalah mekanisme alami tubuh untuk melindungi kita. Cobalah untuk mengidentifikasi sumber ketakutanmu dan hadapi secara bertahap. Ingat, keberanian bukan berarti tidak takut, tapi tetap melangkah meski ada rasa takut.",
    "Saat rasa takut datang, fokuskan diri pada hal-hal yang bisa kamu kontrol. Praktikkan teknik grounding dan pernapasan dalam. Kamu lebih kuat dari yang kamu kira!",
    "Ketakutan sering kali adalah proyeksi masa depan yang belum terjadi. Kembalilah ke momen sekarang dan fokus pada langkah-langkah kecil yang bisa kamu ambil. Setiap langkah kecil adalah kemenangan.",
    "Bayangkan ketakutanmu seperti awan yang berlalu. Mereka datang dan pergi. Kamu adalah langit yang tetap ada, kuat dan tak tergoyahkan. Percayalah pada kekuatanmu sendiri."
  ];
  
  const loveHints = [
    "Cinta adalah energi yang luar biasa untuk pertumbuhan diri. Gunakan perasaan ini untuk menyebarkan kebaikan dan empati pada sekitarmu. Ingat, cinta yang tulus selalu bermula dari mencintai diri sendiri.",
    "Saat hatimu dipenuhi cinta, bagikan kehangatan ini pada orang lain. Buat seseorang tersenyum hari ini, atau tunjukkan apresiasi pada orang-orang yang kamu sayangi.",
    "Cinta membuat kita menjadi versi terbaik diri kita. Manfaatkan energi positif ini untuk melakukan kebaikan dan membuat perubahan positif di sekitarmu.",
    "Rasakan dan syukuri cinta yang ada dalam hidupmu. Ekspresikan rasa sayangmu pada orang-orang terdekat. Ingat, tindakan kecil penuh kasih bisa membuat perbedaan besar."
  ];
  
  const angerHints = [
    "Kemarahan adalah sinyal bahwa ada sesuatu yang perlu diperhatikan. Ambil jeda sejenak, tarik napas dalam-dalam, dan tanyakan pada diri sendiri apa yang sebenarnya membuatmu marah. Gunakan energi ini untuk mencari solusi, bukan destruksi.",
    "Saat amarah datang, ingat bahwa kamu lebih besar dari emosimu. Beri dirimu waktu untuk tenang sebelum mengambil keputusan. Cobalah aktivitas fisik untuk menyalurkan energi negatif.",
    "Kemarahan sering kali adalah topeng dari rasa sakit atau kecewa. Coba identifikasi perasaan di balik amarahmu. Komunikasikan perasaanmu dengan cara yang sehat dan konstruktif.",
    "Amarah adalah energi yang kuat. Alihkan energi ini ke hal-hal produktif seperti olahraga atau aktivitas kreatif. Ingat, cara kita merespons amarah menentukan dampaknya pada diri kita."
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