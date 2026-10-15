// بيانات تجريبية فقط لاختبار الشكل. ستُستبدل ببيانات حقيقية من الخادم لاحقاً.
// الأرقام كلها وهمية (0000000000) ولا تعود لأي شخص.
window.DATA = {
  version: "sample-1",
  updated: {
    services: "2026-10-16",
    ads: "2026-10-16",
    transport: "2026-10-16",
    album: "2026-10-16",
    complaints: "2026-10-16"
  },
  villages: [
    { id: "v1", name: "قريتي" },
    { id: "v2", name: "القرية المجاورة (أ)" },
    { id: "v3", name: "القرية المجاورة (ب)" }
  ],
  serviceTypes: [
    { id: "shop", name: "محل تجاري" },
    { id: "electric", name: "كهربائي" },
    { id: "plumber", name: "سباك" },
    { id: "pharmacy", name: "صيدلية" },
    { id: "clinic", name: "عيادة" },
    { id: "vet", name: "طبيب بيطري" },
    { id: "workshop", name: "ورشة إصلاح" },
    { id: "transport", name: "خدمة نقل" }
  ],
  services: [
    { id: "s1", name: "بقالة النموذج", type: "shop", desc: "مواد غذائية ومنزلية. اسم تجريبي.", phone: "0000000000", whatsapp: "0000000000", village: "v1", address: "قرب الساحة", updated: "2026-10-16" },
    { id: "s2", name: "كهربائي تجريبي", type: "electric", desc: "تمديدات وإصلاح أعطال كهربائية.", phone: "0000000000", whatsapp: "", village: "v1", address: "", updated: "2026-10-16" },
    { id: "s3", name: "سباك تجريبي", type: "plumber", desc: "إصلاح وتمديد مواسير المياه.", phone: "0000000000", whatsapp: "0000000000", village: "v2", address: "", updated: "2026-10-16" },
    { id: "s4", name: "صيدلية النموذج", type: "pharmacy", desc: "أدوية ومستلزمات طبية. اسم تجريبي.", phone: "0000000000", whatsapp: "", village: "v2", address: "الشارع الرئيسي", updated: "2026-10-16" },
    { id: "s5", name: "عيادة تجريبية", type: "clinic", desc: "عيادة عامة. أوقات الدوام تُكتب هنا لاحقاً.", phone: "0000000000", whatsapp: "", village: "v3", address: "قرب المدرسة", updated: "2026-10-16" },
    { id: "s6", name: "طبيب بيطري تجريبي", type: "vet", desc: "رعاية الأغنام والأبقار.", phone: "0000000000", whatsapp: "0000000000", village: "v3", address: "", updated: "2026-10-16" },
    { id: "s7", name: "ورشة إصلاح تجريبية", type: "workshop", desc: "إصلاح مركبات ودراجات نارية.", phone: "0000000000", whatsapp: "", village: "v1", address: "طريق القرية الجنوبي", updated: "2026-10-16" },
    { id: "s8", name: "خدمة نقل تجريبية", type: "transport", desc: "نقل أغراض وأثاث ضمن القرى المجاورة.", phone: "0000000000", whatsapp: "0000000000", village: "v2", address: "", updated: "2026-10-16" }
  ],
  adCategories: [
    { id: "agri", name: "منتجات زراعية" },
    { id: "used", name: "أغراض مستعملة" },
    { id: "furniture", name: "أثاث وأدوات منزلية" },
    { id: "jobs", name: "فرص عمل" },
    { id: "business", name: "إعلان تجاري أو خدمي" }
  ],
  ads: [
    { id: "a1", title: "زيت زيتون بلدي", desc: "عبوات متوسطة. إعلان تجريبي.", category: "agri", village: "v1", phone: "0000000000", price: "حسب الاتفاق", date: "2026-10-15" },
    { id: "a2", title: "دراجة نارية مستعملة", desc: "حالة جيدة. إعلان تجريبي.", category: "used", village: "v2", phone: "0000000000", price: "", date: "2026-10-14" },
    { id: "a3", title: "خزانة خشبية", desc: "خزانة بأربعة أبواب. إعلان تجريبي.", category: "furniture", village: "v3", phone: "0000000000", price: "", date: "2026-10-13" },
    { id: "a4", title: "مطلوب عامل في ورشة", desc: "خبرة بسيطة تكفي. فرصة تجريبية.", category: "jobs", village: "v1", phone: "0000000000", price: "", date: "2026-10-12" },
    { id: "a5", title: "مطلوب سائق نقل", desc: "للعمل بين القرى. فرصة تجريبية.", category: "jobs", village: "v2", phone: "0000000000", price: "", date: "2026-10-11" },
    { id: "a6", title: "عسل جبلي", desc: "برطمانات صغيرة وكبيرة. إعلان تجريبي.", category: "agri", village: "v3", phone: "0000000000", price: "", date: "2026-10-10" },
    { id: "a7", title: "افتتاح محل جديد", desc: "عروض الافتتاح. إعلان تجريبي.", category: "business", village: "v1", phone: "0000000000", price: "", date: "2026-10-09" }
  ],
  routes: [
    { id: "r1", name: "خط الصباح", from: "قريتي", to: "المدينة", driver: "سائق تجريبي", phone: "0000000000", times: "الانطلاق نحو السابعة صباحاً (تجريبي)", notes: "الموعد غير مؤكد.", updated: "2026-10-16" },
    { id: "r2", name: "خط القرى المجاورة", from: "قريتي", to: "القرية المجاورة (أ)", driver: "سائق تجريبي", phone: "0000000000", times: "", notes: "يتحرك عند امتلاء المركبة.", updated: "2026-10-16" },
    { id: "r3", name: "خط المساء", from: "المدينة", to: "قريتي", driver: "سائق تجريبي", phone: "0000000000", times: "الانطلاق نحو الثانية بعد الظهر (تجريبي)", notes: "", updated: "2026-10-16" }
  ],
  photoCats: [
    { id: "nature", name: "الطبيعة", color: "#4f9a62", icon: "🌿" },
    { id: "roads", name: "الطرقات", color: "#8a7a5a", icon: "🛣️" },
    { id: "landmarks", name: "المعالم", color: "#6a82a8", icon: "🏛️" },
    { id: "events", name: "المناسبات", color: "#b9794f", icon: "🎉" }
  ],
  photos: [
    { id: "p1", caption: "منظر من أطراف القرية. صورة تجريبية.", cat: "nature", village: "v1", date: "2026-10-10" },
    { id: "p2", caption: "الطريق إلى القرية المجاورة. صورة تجريبية.", cat: "roads", village: "v2", date: "2026-10-09" },
    { id: "p3", caption: "معلم قديم في القرية. صورة تجريبية.", cat: "landmarks", village: "v1", date: "2026-10-08" },
    { id: "p4", caption: "مناسبة في الساحة. صورة تجريبية.", cat: "events", village: "v3", date: "2026-10-07" },
    { id: "p5", caption: "حقول الربيع. صورة تجريبية.", cat: "nature", village: "v3", date: "2026-10-06" },
    { id: "p6", caption: "طريق ترابي بعد المطر. صورة تجريبية.", cat: "roads", village: "v1", date: "2026-10-05" }
  ],
  complaints: [
    { id: "c1", text: "نص شكوى تجريبي يظهر هنا كما كتبه صاحبه تماماً دون أي تعديل. الإنارة في الطريق الرئيسي ضعيفة.", village: "v1", date: "2026-10-14" },
    { id: "c2", text: "نص شكوى تجريبي آخر. نرجو الاهتمام بصيانة الطريق بين القريتين.", village: "v2", date: "2026-10-12" }
  ]
};
