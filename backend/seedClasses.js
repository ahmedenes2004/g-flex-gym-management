import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GymClass from './models/GymClass.js';
import User from './models/User.js';

dotenv.config();

const classesData = [
    // --- FITNESS CATEGORY ---
    {
        name: 'Hipertrofi ve Ağırlık Antrenmanı',
        description: 'Kas kütlesini artırmaya yönelik temel ağırlık kaldırma teknikleri ve hipertrofi odaklı çalışma.',
        category: 'Fitness',
        capacity: 15,
        dayOffset: 0, // Pazartesi
        hour: 9,
        minute: 0
    },
    {
        name: 'Full Body (Tüm Vücut) Güç',
        description: 'Tüm ana kas gruplarını hedef alan, bileşik hareketlerden oluşan genel kuvvet antrenmanı.',
        category: 'Fitness',
        capacity: 20,
        dayOffset: 1, // Salı
        hour: 10,
        minute: 0
    },
    {
        name: 'Alt Vücut (Leg Day) Şekillendirme',
        description: 'Quadriceps, hamstring ve gluteus kaslarını güçlendiren, squat ve lunge ağırlıklı antrenman.',
        category: 'Fitness',
        capacity: 15,
        dayOffset: 2, // Çarşamba
        hour: 18,
        minute: 30
    },
    {
        name: 'Üst Vücut İtiş & Çekiş (Push/Pull)',
        description: 'Göğüs, omuz, sırt ve kol kaslarını dengeli bir şekilde çalıştıran hipertrofi dersi.',
        category: 'Fitness',
        capacity: 15,
        dayOffset: 3, // Perşembe
        hour: 14,
        minute: 0
    },
    {
        name: 'Core Kuvveti & Karın',
        description: 'Vücut duruşunu (postür) iyileştiren, merkez bölgesi ve karın kaslarını çelikleştiren ders.',
        category: 'Fitness',
        capacity: 20,
        dayOffset: 4, // Cuma
        hour: 17,
        minute: 0
    },

    // --- KARDIYO & KOŞU CATEGORY ---
    {
        name: 'Interval Koşu Bandı Kondisyonu',
        description: 'Koşu bandında hız ve eğim varyasyonları kullanarak yağ yakımını maksimize eden kardiyo dersi.',
        category: 'Kardiyo & Koşu',
        capacity: 10,
        dayOffset: 0, // Pazartesi
        hour: 11,
        minute: 0
    },
    {
        name: 'Hi-Low Aerobik ve Kondisyon',
        description: 'Yüksek ve düşük tempolu müzikli aerobik hareketlerle kalp ritmini artıran dinamik seans.',
        category: 'Kardiyo & Koşu',
        capacity: 20,
        dayOffset: 1, // Salı
        hour: 19,
        minute: 0
    },
    {
        name: 'Açık Hava Dayanıklılık Koşusu',
        description: 'Grup halinde açık havada ritimli tempo koşusu ve kardiyovasküler kapasite geliştirme.',
        category: 'Kardiyo & Koşu',
        capacity: 25,
        dayOffset: 5, // Cumartesi
        hour: 8,
        minute: 30
    },
    {
        name: 'Fartlek Ritim Koşusu',
        description: 'Değişken hız oyunlarıyla dayanıklılığı ve hızı artıran koşu teknikleri.',
        category: 'Kardiyo & Koşu',
        capacity: 12,
        dayOffset: 3, // Perşembe
        hour: 9,
        minute: 30
    },
    {
        name: 'Tabata Kardiyo Yağ Yakımı',
        description: '20 saniye çalışma, 10 saniye dinlenme esasına dayanan yüksek yoğunluklu kardiyo antrenmanı.',
        category: 'Kardiyo & Koşu',
        capacity: 18,
        dayOffset: 4, // Cuma
        hour: 12,
        minute: 0
    },

    // --- İP ATLAMA CATEGORY ---
    {
        name: 'Temel İp Atlama Teknikleri',
        description: 'İp atlamaya yeni başlayanlar için koordinasyon, ayak oyunları ve bilek hareketleri eğitimi.',
        category: 'İp Atlama',
        capacity: 15,
        dayOffset: 0, // Pazartesi
        hour: 14,
        minute: 30
    },
    {
        name: 'Hız ve Çeviklik İp Antrenmanı',
        description: 'Çift çevirme (double unders) ve çapraz geçişler içeren, kondisyon artırıcı ileri seviye ip atlama.',
        category: 'İp Atlama',
        capacity: 12,
        dayOffset: 2, // Çarşamba
        hour: 10,
        minute: 30
    },
    {
        name: 'Jump Rope & Abs Kombosu',
        description: 'İp atlama aralarında uygulanan karın hareketleriyle hem yağ yakıp hem karın kası yaptıran ders.',
        category: 'İp Atlama',
        capacity: 15,
        dayOffset: 4, // Cuma
        hour: 15,
        minute: 0
    },
    {
        name: 'Kondisyoner İp Atlama Seansı',
        description: 'Boksörlerin dayanıklılık kazanmak için uyguladığı uzun süreli yüksek tempolu ip atlama antrenmanı.',
        category: 'İp Atlama',
        capacity: 15,
        dayOffset: 6, // Pazar
        hour: 11,
        minute: 0
    },

    // --- PILATES CATEGORY ---
    {
        name: 'Başlangıç Seviyesi Mat Pilates',
        description: 'Temel pilates hareketleri, nefes teknikleri ve core aktivasyonu ile duruş hizalama.',
        category: 'Pilates',
        capacity: 18,
        dayOffset: 1, // Salı
        hour: 9,
        minute: 0
    },
    {
        name: 'Orta Seviye Reformer Pilates',
        description: 'Aletli reformer üzerinde kas boyunu uzatan, denge ve esneklik odaklı pilates antrenmanı.',
        category: 'Pilates',
        capacity: 8,
        dayOffset: 2, // Çarşamba
        hour: 16,
        minute: 0
    },
    {
        name: 'Pilates Core & Kalça Şekillendirme',
        description: 'Pilates çemberi ve bandı kullanılarak kalça, basen ve karın bölgelerini sıkılaştıran ders.',
        category: 'Pilates',
        capacity: 20,
        dayOffset: 4, // Cuma
        hour: 10,
        minute: 0
    },
    {
        name: 'Esneklik ve Omurga Sağlığı',
        description: 'Masa başı çalışanlar için sırt ağrılarını hafifletmeye ve omurgayı rahatlatmaya odaklı pilates.',
        category: 'Pilates',
        capacity: 20,
        dayOffset: 5, // Cumartesi
        hour: 13,
        minute: 0
    },

    // --- YOGA CATEGORY ---
    {
        name: 'Güne Merhaba Vinyasa Yoga',
        description: 'Nefes ve hareket akışının senkronize olduğu, güne enerjik başlatan vinyasa serisi.',
        category: 'Yoga',
        capacity: 22,
        dayOffset: 0, // Pazartesi
        hour: 8,
        minute: 0
    },
    {
        name: 'Hatha Yoga ile Zihinsel Denge',
        description: 'Duruşların (asanaların) daha uzun süre tutulduğu, esneklik ve güç kazandıran klasik yoga.',
        category: 'Yoga',
        capacity: 20,
        dayOffset: 2, // Çarşamba
        hour: 19,
        minute: 30
    },
    {
        name: 'Derin Gevşeme ve Yin Yoga',
        description: 'Bağ dokuları esneten, zihni sakinleştiren ve bedeni tamamen dinlendiren yavaş tempolu yoga.',
        category: 'Yoga',
        capacity: 25,
        dayOffset: 3, // Perşembe
        hour: 20,
        minute: 0
    },
    {
        name: 'Power Yoga & Denge',
        description: 'Güç, esneklik ve dengeyi bir arada sınayan, dinamik ve meydan okuyucu asanalar.',
        category: 'Yoga',
        capacity: 18,
        dayOffset: 5, // Cumartesi
        hour: 10,
        minute: 0
    },
    {
        name: 'Nefes (Pranayama) ve Meditasyon',
        description: 'Stresi azaltan solunum teknikleri ve zihni dinginleştiren rehberli meditasyon seansı.',
        category: 'Yoga',
        capacity: 30,
        dayOffset: 6, // Pazar
        hour: 18,
        minute: 0
    },

    // --- CROSSFIT CATEGORY ---
    {
        name: 'Günün Antrenmanı (WOD)',
        description: 'Yüksek yoğunluklu, fonksiyonel hareketlerden oluşan klasik CrossFit WOD seansı.',
        category: 'CrossFit',
        capacity: 12,
        dayOffset: 0, // Pazartesi
        hour: 18,
        minute: 0
    },
    {
        name: 'Olimpik Halter Teknikleri',
        description: 'Clean & Jerk ve Snatch hareketlerinin teknik analizi, kaldırış güvenliği ve patlayıcı güç.',
        category: 'CrossFit',
        capacity: 8,
        dayOffset: 1, // Salı
        hour: 17,
        minute: 30
    },
    {
        name: 'Kettlebell & Dumbbell Kondisyon',
        description: 'Serbest ağırlıklarla fonksiyonel ve metabolik hızı tavan yaptıran CrossFit kondisyonu.',
        category: 'CrossFit',
        capacity: 15,
        dayOffset: 3, // Perşembe
        hour: 12,
        minute: 0
    },
    {
        name: 'Gymnastic CrossFit (Vücut Ağırlığı)',
        description: 'Amuda kalkma, barfiks ve jimnastik halkaları kullanarak vücut kontrolünü artıran ders.',
        category: 'CrossFit',
        capacity: 10,
        dayOffset: 4, // Cuma
        hour: 19,
        minute: 30
    },
    {
        name: 'CrossFit Partner WOD Challenge',
        description: 'Takım ruhunu yansıtan, ikişerli eşleşmelerle yapılan eğlenceli ve yorucu WOD.',
        category: 'CrossFit',
        capacity: 16,
        dayOffset: 5, // Cumartesi
        hour: 11,
        minute: 0
    },

    // --- BOKS & KIKBOKS CATEGORY ---
    {
        name: 'Temel Boks Duruş ve Yumrukları',
        description: 'Jab, direk, kroşe ve aparkat yumruklarının teknikleri ile gard alma ve ayak oyunları.',
        category: 'Boks & Kickboks',
        capacity: 15,
        dayOffset: 1, // Salı
        hour: 12,
        minute: 0
    },
    {
        name: 'Boks Torbası Antrenmanı (Heavy Bag)',
        description: 'Torba karşısında ritimli ve güçlü yumruk kombinasyonlarıyla harika bir kardiyo ve stres atma dersi.',
        category: 'Boks & Kickboks',
        capacity: 12,
        dayOffset: 2, // Çarşamba
        hour: 17,
        minute: 30
    },
    {
        name: 'Kickboks Kombinasyon & Kondisyon',
        description: 'Yumruk ve tekme kombinasyonlarıyla kalori harcatan, hızı ve dayanıklılığı artıran antrenman.',
        category: 'Boks & Kickboks',
        capacity: 15,
        dayOffset: 3, // Perşembe
        hour: 18,
        minute: 30
    },
    {
        name: 'Gölge Boksu ve Savunma Teknikleri',
        description: 'Eskiv, blok ve shadow boxing antrenmanı ile refleks geliştirme ve form kazanma dersi.',
        category: 'Boks & Kickboks',
        capacity: 18,
        dayOffset: 5, // Cumartesi
        hour: 15,
        minute: 0
    },

    // --- SPINNING CATEGORY ---
    {
        name: 'Spinning Ritim & Interval Bisiklet',
        description: 'Müzik temposuna göre tırmanış ve sprint antrenmanları yapılan yüksek tempolu spinning.',
        category: 'Spinning',
        capacity: 15,
        dayOffset: 0, // Pazartesi
        hour: 20,
        minute: 0
    },
    {
        name: 'Endurance Bisiklet Dayanıklılığı',
        description: 'Uzun süreli orta tempo pedallama ile kardiyovasküler dayanıklılık kazandıran seans.',
        category: 'Spinning',
        capacity: 15,
        dayOffset: 2, // Çarşamba
        hour: 9,
        minute: 0
    },
    {
        name: 'Spinning Hills (Tepe Tırmanışı)',
        description: 'Yüksek direnç seviyelerinde bacak kaslarını (quadriceps/gluteus) yakacak tırmanış simülasyonu.',
        category: 'Spinning',
        capacity: 15,
        dayOffset: 4, // Cuma
        hour: 18,
        minute: 0
    }
];

const seedClasses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding classes...');

        // Find a default trainer/admin to assign the classes to
        const trainer = await User.findOne({ role: { $in: ['admin', 'trainer'] } });
        if (!trainer) {
            console.error('Lütfen önce sisteme en az bir Admin veya Eğitmen hesabı kaydedin!');
            process.exit(1);
        }
        console.log(`Dersler şu eğitmene atanacak: ${trainer.name} (${trainer.email})`);

        // Clear existing classes
        await GymClass.deleteMany({});
        console.log('Eski dersler temizlendi.');

        // Helper to get next occurrence of a weekday with specific hour/minute
        // 0: Sunday, 1: Monday, 2: Tuesday, etc.
        const getNextDateForDayOffset = (dayOffset, hour, minute) => {
            const today = new Date();
            // Start from today, set hour and minute
            const date = new Date(today);
            date.setHours(hour, minute, 0, 0);

            // dayOffset represents Monday=0, Tuesday=1, etc.
            // Map dayOffset to DateJS getDay() format: Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6, Sunday=0
            const jsDayTarget = dayOffset === 6 ? 0 : dayOffset + 1;

            const currentJsDay = date.getDay();
            let distance = jsDayTarget - currentJsDay;
            if (distance < 0) {
                distance += 7; // Next week
            }
            date.setDate(date.getDate() + distance);
            return date;
        };

        const classesToInsert = classesData.map(cls => {
            const scheduleDate = getNextDateForDayOffset(cls.dayOffset, cls.hour, cls.minute);
            return {
                name: cls.name,
                description: cls.description,
                category: cls.category,
                trainer: trainer._id,
                schedule: scheduleDate,
                capacity: cls.capacity,
                enrolledMembers: []
            };
        });

        await GymClass.insertMany(classesToInsert);
        console.log(`Başarıyla ${classesToInsert.length} adet ders veritabanına eklendi!`);
        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Hata:', error);
        process.exit(1);
    }
};

seedClasses();
