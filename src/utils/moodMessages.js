const happyMessages = {
    sympathyMessages: [
      "Sungguh luar biasa! Kamu bisa menjaga mood yang positif. Terus pertahankan ini!",
      "Senang melihat semangatmu hari ini! Energi positifmu bisa menginspirasi orang lain.",
      "Kamu sudah melakukan yang terbaik hari ini. Pertahankan energi positif ini!",
      "Mood-mu yang cerah hari ini adalah bukti bahwa kamu bisa melewati hari dengan baik."
    ],
    thoughtfulSuggestions: [
      [
        "Coba ambil waktu untuk refleksi dan bersyukur atas hal-hal baik hari ini",
        "Bagikan cerita positifmu dengan orang terdekat",
        "Rencanakan aktivitas menyenangkan untuk besok"
      ],
      [
        "Dokumentasikan momen bahagia ini dalam jurnal atau foto",
        "Dengarkan musik favoritmu dan bergoyang mengikuti irama",
        "Kirim pesan apresiatif untuk orang yang kamu sayangi"
      ],
      [
        "Lakukan hobi yang membuatmu senang",
        "Rayakan pencapaian kecil hari ini",
        "Buat playlist lagu-lagu yang membuatmu semangat"
      ]
    ],
    thingsToDo: [
      [
        "Bagikan senyuman dan kata-kata positif ke orang di sekitarmu",
        "Tulis 3 hal yang membuatmu bersyukur hari ini",
        "Rencanakan aktivitas seru untuk akhir pekan"
      ],
      [
        "Buat daftar playlist musik yang membuatmu bahagia",
        "Telepon teman atau keluarga untuk berbagi cerita",
        "Lakukan random act of kindness hari ini"
      ],
      [
        "Mulai proyek kreatif yang sudah lama kamu rencanakan",
        "Buat bucket list untuk bulan depan",
        "Dekorasi ruanganmu agar lebih ceria"
      ]
    ]
  };
  
  const sadMessages = {
    sympathyMessages: [
      "Hari ini mungkin terasa berat, tapi ingat bahwa perasaan ini tidak akan berlangsung selamanya.",
      "Tidak apa-apa merasa sedih. Beri dirimu ruang untuk merasakan dan memproses emosimu.",
      "Kamu lebih kuat dari yang kamu kira. Setiap hari adalah kesempatan baru.",
      "Aku ada di sini untukmu. Wajar untuk merasa sedih, dan kamu tidak sendirian."
    ],
    thoughtfulSuggestions: [
      [
        "Cobalah untuk tidak terlalu keras pada dirimu sendiri",
        "Ambil waktu sejenak untuk merawat diri",
        "Dengarkan musik yang menenangkan"
      ],
      [
        "Buat secangkir teh hangat dan nikmati dengan tenang",
        "Tuliskan perasaanmu tanpa filter di jurnal",
        "Hubungi teman yang bisa dipercaya untuk berbagi cerita"
      ],
      [
        "Lakukan aktivitas yang membuatmu nyaman",
        "Beri dirimu istirahat yang cukup",
        "Coba teknik pernapasan untuk menenangkan diri"
      ]
    ],
    thingsToDo: [
      [
        "Buat jadwal tidur yang teratur",
        "Dengarkan podcast atau audiobook yang menenangkan",
        "Lakukan stretching ringan"
      ],
      [
        "Rapikan kamar untuk menjernihkan pikiran",
        "Buat list film feel-good untuk ditonton",
        "Siapkan makanan sehat favoritmu"
      ],
      [
        "Jalan-jalan singkat di taman terdekat",
        "Gambar atau warnai untuk mengalihkan pikiran",
        "Buat playlist lagu yang menenangkan"
      ]
    ]
  };
  
  const fearMessages = {
    sympathyMessages: [
      "Wajar kalau kamu merasa takut atau cemas. Ingat, kamu tidak sendirian.",
      "Rasa takut adalah respon alami, tapi kamu lebih kuat dari ketakutanmu.",
      "Setiap langkah kecil menghadapi ketakutan adalah sebuah kemenangan.",
      "Kamu sudah berani mengakui perasaanmu, itu langkah pertama yang hebat."
    ],
    thoughtfulSuggestions: [
      [
        "Fokus pada pernapasan. Tarik napas dalam-dalam",
        "Identifikasi hal-hal yang masih dalam kontrolmu",
        "Praktikkan teknik grounding 5-4-3-2-1"
      ],
      [
        "Tulis ketakutanmu dan tantang dengan fakta",
        "Buat rencana kecil untuk menghadapi ketakutan",
        "Cari informasi untuk memahami situasimu"
      ],
      [
        "Lakukan meditasi singkat",
        "Fokus pada momen sekarang",
        "Buat safe space di rumahmu"
      ]
    ],
    thingsToDo: [
      [
        "Lakukan latihan pernapasan 4-7-8",
        "Buat daftar hal yang membuatmu merasa aman",
        "Dengarkan suara alam atau white noise"
      ],
      [
        "Peluk bantal atau boneka kesayanganmu",
        "Nyalakan lampu dan musik yang menenangkan",
        "Hubungi teman yang bisa membuatmu tenang"
      ],
      [
        "Lakukan aktivitas yang familiar dan menenangkan",
        "Buat routine yang membuatmu nyaman",
        "Catat progress kecil menghadapi ketakutan"
      ]
    ]
  };
  
  const loveMessages = {
    sympathyMessages: [
      "Wow, indah sekali bisa merasakan cinta dan kasih sayang!",
      "Cinta adalah energi yang luar biasa, nikmati momen ini.",
      "Berbagi cinta adalah hal yang membahagiakan, terus lakukan itu!",
      "Kamu pantas merasakan dan memberi cinta. Teruslah berbagi kebaikan."
    ],
    thoughtfulSuggestions: [
      [
        "Ekspresikan rasa sayangmu pada orang terdekat",
        "Luangkan waktu quality time bersama",
        "Buat kejutan kecil untuk orang tersayang"
      ],
      [
        "Tulis surat untuk orang yang kamu sayangi",
        "Rencanakan aktivitas bersama yang bermakna",
        "Bagikan momen bahagia dengan orang terkasih"
      ],
      [
        "Buat album foto digital tentang momen bersama",
        "Masak makanan spesial untuk orang tersayang",
        "Rencanakan date night yang romantis"
      ]
    ],
    thingsToDo: [
      [
        "Kirim pesan apresiasi pada orang tersayang",
        "Buat playlist lagu romantis favorit",
        "Siapkan hadiah kecil yang bermakna"
      ],
      [
        "Lakukan aktivitas bersama yang menyenangkan",
        "Buat scrapbook digital tentang hubunganmu",
        "Rencanakan perjalanan kecil berdua"
      ],
      [
        "Buat tradisi baru bersama orang tersayang",
        "Share hobi dengan pasangan atau keluarga",
        "Dokumentasikan momen-momen spesial"
      ]
    ]
  };
  
  const angerMessages = {
    sympathyMessages: [
      "Aku paham kamu sedang kesal. Ini normal dan kamu berhak merasakan ini.",
      "Amarah adalah emosi yang valid. Mari kita kelola bersama.",
      "Kamu sudah berani mengakui perasaan ini, itu langkah yang bagus.",
      "Wajar merasa marah, tapi ingat untuk tidak membiarkan amarah mengendalikanmu."
    ],
    thoughtfulSuggestions: [
      [
        "Ambil jeda sebelum merespons situasi",
        "Identifikasi pemicu kemarahan",
        "Lakukan aktivitas fisik untuk menyalurkan energi"
      ],
      [
        "Coba teknik counting backward dari 10",
        "Pindah ke ruangan atau tempat yang berbeda",
        "Tulis semua yang kamu rasakan di jurnal"
      ],
      [
        "Praktikkan deep breathing exercises",
        "Fokus pada solusi, bukan masalah",
        "Cari cara konstruktif menyalurkan emosi"
      ]
    ],
    thingsToDo: [
      [
        "Olahraga atau lakukan aktivitas fisik",
        "Pukul bantal atau berteriak di bantal",
        "Dengarkan musik yang menenangkan"
      ],
      [
        "Gambar atau coret-coret untuk ekspresikan emosi",
        "Lakukan boxing dengan samsak",
        "Buat list solusi untuk masalahmu"
      ],
      [
        "Lari atau jalan cepat di tempat",
        "Hancurkan kertas bekas atau kardus",
        "Mainkan alat musik atau bernyanyi keras"
      ]
    ]
  };
  
  module.exports = {
    happyMessages,
    sadMessages,
    fearMessages,
    loveMessages,
    angerMessages
  };