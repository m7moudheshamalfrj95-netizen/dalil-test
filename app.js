(function () {
  "use strict";

  var D = null; // تُملأ من التخزين المحلي عند بدء التطبيق (انظر آخر الملف)
  var view = document.getElementById("view");
  var backEl = document.getElementById("back");
  var titleEl = document.getElementById("title");
  var offlineEl = document.getElementById("offline");

  // ---------- أدوات صغيرة ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function find(list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
    return null;
  }
  function nameOf(list, id) { var x = find(list, id); return x ? x.name : ""; }
  function has(text, q) { return String(text || "").toLowerCase().indexOf(q) !== -1; }
  function options(list, allLabel, selected) {
    var h = '<option value="">' + esc(allLabel) + "</option>";
    for (var i = 0; i < list.length; i++) {
      h += '<option value="' + esc(list[i].id) + '"' + (list[i].id === selected ? " selected" : "") + ">" + esc(list[i].name) + "</option>";
    }
    return h;
  }
  function updatedLine(d) { return '<p class="updated">آخر تحديث للمعلومات: ' + esc(d) + "</p>"; }
  function demo() { return '<div class="demo">بيانات تجريبية لاختبار الشكل فقط، وليست معلومات حقيقية.</div>'; }
  function waNumber(p) {
    var d = String(p || "").replace(/\D/g, "");
    return d.charAt(0) === "0" ? "963" + d.slice(1) : d;
  }
  function contactButtons(phone, wa) {
    var h = "";
    if (phone) { h += '<a class="btn" href="tel:' + esc(phone) + '">اتصال</a>'; }
    if (wa) { h += '<a class="btn wa" href="https://wa.me/' + esc(waNumber(wa)) + '">واتساب</a>'; }
    return h ? '<div class="actions">' + h + "</div>" : "";
  }
  function param(query, name) {
    var pairs = query ? query.split("&") : [];
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split("=");
      if (kv[0] === name) {
        try { return decodeURIComponent((kv[1] || "").replace(/\+/g, " ")); } catch (e) { return ""; }
      }
    }
    return "";
  }
  function norm(s) { return String(s || "").trim().toLowerCase(); }

  // ---------- الصفحات ----------
  function pageHome() {
    var items = [
      ["#/services", "🛠️", "الخدمات المحلية"],
      ["#/ads", "🛒", "السوق والإعلانات"],
      ["#/transport", "🚌", "المواصلات بين القرى"],
      ["#/jobs", "💼", "فرص العمل"],
      ["#/album", "🖼️", "ألبوم صور القرية"],
      ["#/complaints", "📢", "شكاوى أبناء القرية"],
      ["#/search", "🔎", "البحث"],
      ["#/about", "ℹ️", "عن التطبيق والتواصل"]
    ];
    var html = demo() +
      '<form id="homeSearch"><input type="search" id="hq" placeholder="ابحث عن خدمة أو إعلان"></form><div class="grid">';
    for (var i = 0; i < items.length; i++) {
      html += '<a class="tile-link" href="' + items[i][0] + '"><span class="ic">' + items[i][1] + "</span>" + esc(items[i][2]) + "</a>";
    }
    html += "</div>";
    return {
      title: "دليل قريتي", back: null, html: html,
      after: function () {
        document.getElementById("homeSearch").addEventListener("submit", function (e) {
          e.preventDefault();
          location.hash = "#/search?q=" + encodeURIComponent(document.getElementById("hq").value);
        });
      }
    };
  }

  function serviceCard(s) {
    return '<a class="card" href="#/service/' + esc(s.id) + '"><b>' + esc(s.name) + "</b><span>" +
      esc(nameOf(D.serviceTypes, s.type)) + " · " + esc(nameOf(D.villages, s.village)) + "</span></a>";
  }
  function pageServices() {
    var html = demo() + '<div class="filters">' +
      '<input type="search" id="q" placeholder="ابحث بالاسم أو النوع أو القرية">' +
      '<select id="ft">' + options(D.serviceTypes, "كل الأنواع") + "</select>" +
      '<select id="fv">' + options(D.villages, "كل القرى") + "</select></div>" +
      '<div id="list"></div>' + updatedLine(D.updated.services);
    return {
      title: "الخدمات المحلية", back: "#/", html: html,
      after: function () {
        var q = document.getElementById("q"), ft = document.getElementById("ft"), fv = document.getElementById("fv"), list = document.getElementById("list");
        function draw() {
          var text = norm(q.value), out = "";
          for (var i = 0; i < D.services.length; i++) {
            var s = D.services[i];
            if (ft.value && s.type !== ft.value) { continue; }
            if (fv.value && s.village !== fv.value) { continue; }
            if (text && !(has(s.name, text) || has(s.desc, text) || has(nameOf(D.serviceTypes, s.type), text) || has(nameOf(D.villages, s.village), text))) { continue; }
            out += serviceCard(s);
          }
          list.innerHTML = out || '<p class="empty">لا توجد نتائج مطابقة.</p>';
        }
        q.addEventListener("input", draw); ft.addEventListener("change", draw); fv.addEventListener("change", draw);
        draw();
      }
    };
  }
  function pageService(id) {
    var s = find(D.services, id);
    if (!s) { return pageNotFound("#/services"); }
    var html = demo() + "<h2>" + esc(s.name) + "</h2>" +
      '<p class="muted">' + esc(nameOf(D.serviceTypes, s.type)) + " · " + esc(nameOf(D.villages, s.village)) + "</p>" +
      "<p>" + esc(s.desc) + "</p>" +
      (s.address ? "<p>العنوان: " + esc(s.address) + "</p>" : "") +
      contactButtons(s.phone, s.whatsapp) + updatedLine(s.updated);
    return { title: "تفاصيل الخدمة", back: "#/services", html: html };
  }

  function adCard(a) {
    return '<a class="card" href="#/ad/' + esc(a.id) + '"><b>' + esc(a.title) + "</b><span>" +
      esc(nameOf(D.adCategories, a.category)) + " · " + esc(nameOf(D.villages, a.village)) +
      (a.price ? " · " + esc(a.price) : "") + "</span></a>";
  }
  function pageAds(jobsOnly) {
    var cats = [];
    for (var i = 0; i < D.adCategories.length; i++) { if (D.adCategories[i].id !== "jobs") { cats.push(D.adCategories[i]); } }
    var html = demo() + '<div class="filters">' +
      (jobsOnly ? "" : '<select id="fc">' + options(cats, "كل التصنيفات") + "</select>") +
      '<select id="fv">' + options(D.villages, "كل القرى") + "</select></div>" +
      '<div id="list"></div>' + updatedLine(D.updated.ads);
    return {
      title: jobsOnly ? "فرص العمل" : "السوق والإعلانات", back: "#/", html: html,
      after: function () {
        var fc = document.getElementById("fc"), fv = document.getElementById("fv"), list = document.getElementById("list");
        function draw() {
          var out = "";
          for (var i = 0; i < D.ads.length; i++) {
            var a = D.ads[i];
            if (jobsOnly && a.category !== "jobs") { continue; }
            if (!jobsOnly && a.category === "jobs") { continue; }
            if (fc && fc.value && a.category !== fc.value) { continue; }
            if (fv.value && a.village !== fv.value) { continue; }
            out += adCard(a);
          }
          list.innerHTML = out || '<p class="empty">لا توجد إعلانات حالياً.</p>';
        }
        if (fc) { fc.addEventListener("change", draw); }
        fv.addEventListener("change", draw); draw();
      }
    };
  }
  function pageAd(id) {
    var a = find(D.ads, id);
    if (!a) { return pageNotFound("#/ads"); }
    var html = demo() + "<h2>" + esc(a.title) + "</h2>" +
      '<p class="muted">' + esc(nameOf(D.adCategories, a.category)) + " · " + esc(nameOf(D.villages, a.village)) + "</p>" +
      "<p>" + esc(a.desc) + "</p>" + (a.price ? "<p>السعر: " + esc(a.price) + "</p>" : "") +
      contactButtons(a.phone, a.phone) + '<p class="updated">تاريخ النشر: ' + esc(a.date) + "</p>";
    return { title: "تفاصيل الإعلان", back: a.category === "jobs" ? "#/jobs" : "#/ads", html: html };
  }

  function pageTransport() {
    var html = demo();
    for (var i = 0; i < D.routes.length; i++) {
      var r = D.routes[i];
      html += '<div class="card"><b>' + esc(r.name) + "</b><span>" + esc(r.from) + " ← " + esc(r.to) + "</span>" +
        (r.times ? "<p>" + esc(r.times) + "</p>" : '<p class="muted">الأوقات غير معروفة.</p>') +
        (r.notes ? '<p class="muted">' + esc(r.notes) + "</p>" : "") +
        "<p>السائق: " + esc(r.driver) + "</p>" + contactButtons(r.phone, "") +
        '<p class="updated">آخر تحديث: ' + esc(r.updated) + "</p></div>";
    }
    html += '<p class="note">تحقق من الموعد بالاتصال بالسائق قبل الخروج، فقد يتغير.</p>';
    return { title: "المواصلات بين القرى", back: "#/", html: html };
  }

  function pageAlbum(query) {
    var cur = param(query, "cat");
    var html = demo() + '<div class="chips"><a class="chip' + (cur ? "" : " on") + '" href="#/album">الكل</a>';
    for (var i = 0; i < D.photoCats.length; i++) {
      var c = D.photoCats[i];
      html += '<a class="chip' + (cur === c.id ? " on" : "") + '" href="#/album?cat=' + esc(c.id) + '">' + esc(c.name) + "</a>";
    }
    html += '</div><div class="photos">';
    var n = 0;
    for (var j = 0; j < D.photos.length; j++) {
      var p = D.photos[j];
      if (cur && p.cat !== cur) { continue; }
      var cat = find(D.photoCats, p.cat);
      html += '<a class="photo" href="#/photo/' + esc(p.id) + '" style="background:' + esc(cat.color) + '"><span class="ic">' + cat.icon + "</span><small>" + esc(p.caption) + "</small></a>";
      n++;
    }
    html += "</div>" + (n ? "" : '<p class="empty">لا توجد صور في هذا التصنيف.</p>') +
      '<div class="actions"><a class="btn" href="#/send-photo">أرسل صورة</a></div>' + updatedLine(D.updated.album);
    return { title: "ألبوم صور القرية", back: "#/", html: html };
  }
  function pagePhoto(id) {
    var p = find(D.photos, id);
    if (!p) { return pageNotFound("#/album"); }
    var cat = find(D.photoCats, p.cat);
    var html = '<div class="photo big" style="background:' + esc(cat.color) + '"><span class="ic">' + cat.icon + "</span></div>" +
      "<p>" + esc(p.caption) + "</p>" +
      '<p class="muted">' + esc(cat.name) + " · " + esc(nameOf(D.villages, p.village)) + " · " + esc(p.date) + "</p>";
    return { title: "الصورة", back: "#/album", html: html };
  }
  function pageSendPhoto() {
    var html = '<div class="note">هذه نسخة تجريبية: لن تُرسل الصورة لأي جهة. ستُرسل الصور لاحقاً إلى الإدارة للمراجعة، ولا تظهر في الألبوم قبل الموافقة.</div>' +
      '<label for="file">اختر صورة (JPG أو PNG أو WebP، حتى 10 ميغابايت)</label>' +
      '<input type="file" id="file" accept="image/jpeg,image/png,image/webp">' +
      '<div id="out"></div>' +
      '<p class="note">لا ترسل صور أشخاص دون إذنهم.</p>';
    return {
      title: "إرسال صورة", back: "#/album", html: html,
      after: function () {
        document.getElementById("file").addEventListener("change", function (e) {
          var out = document.getElementById("out");
          var f = e.target.files && e.target.files[0];
          if (!f) { out.innerHTML = ""; return; }
          var okType = ["image/jpeg", "image/png", "image/webp"].indexOf(f.type) !== -1;
          if (!okType) { out.innerHTML = '<div class="msg err">هذا الملف ليس صورة مسموحة. اختر JPG أو PNG أو WebP.</div>'; return; }
          if (f.size > 10 * 1024 * 1024) { out.innerHTML = '<div class="msg err">حجم الصورة أكبر من 10 ميغابايت.</div>'; return; }
          out.innerHTML = '<div class="msg ok">الصورة مقبولة من حيث النوع والحجم. (تجريبي: لم تُرسل)</div><img class="preview" alt="معاينة" src="' + URL.createObjectURL(f) + '">';
        });
      }
    };
  }

  function pageComplaints() {
    var html = demo();
    for (var i = 0; i < D.complaints.length; i++) {
      var c = D.complaints[i];
      html += '<div class="card"><p class="quote">' + esc(c.text) + "</p><span>" + esc(nameOf(D.villages, c.village)) + " · " + esc(c.date) + "</span></div>";
    }
    html += '<p class="note">هذا رأي صاحب الشكوى وليس رأي التطبيق.</p>' +
      '<div class="actions"><a class="btn" href="#/complaints/new">اكتب شكوى</a></div>' + updatedLine(D.updated.complaints);
    return { title: "شكاوى أبناء القرية", back: "#/", html: html };
  }
  function loadDraft() { return D.draft || {}; }
  function saveDraft(d) { D.draft = d; window.Store.saveDraft(d); }
  function pageComplaintNew() {
    var d = loadDraft();
    var html = '<div class="note">نسخة تجريبية: لن تُرسل الشكوى لأي جهة بعد. تُحفظ مسودتك على هاتفك فقط حتى لا تضيع.</div>' +
      '<form id="cf" novalidate>' +
      '<label for="ct">نص الشكوى (إلزامي)</label><textarea id="ct">' + esc(d.text || "") + "</textarea>" +
      '<label for="cn">اسمك (اختياري، ولا يظهر للعامة)</label><input type="text" id="cn" value="' + esc(d.name || "") + '">' +
      '<label for="cv">القرية (اختياري)</label><select id="cv">' + options(D.villages, "بدون تحديد", d.village || "") + "</select>" +
      '<label class="check"><input type="checkbox" id="cc"><span>أوافق أن تراجع الإدارة شكواي قبل نشرها، وأنها لا تُنشر إلا بعد الموافقة.</span></label>' +
      '<div class="actions"><button class="btn" type="submit">تحقق من الشكوى</button></div>' +
      '<div id="res"></div></form>';
    return {
      title: "كتابة شكوى", back: "#/complaints", html: html,
      after: function () {
        var ct = document.getElementById("ct"), cn = document.getElementById("cn"), cv = document.getElementById("cv"), cc = document.getElementById("cc"), res = document.getElementById("res");
        function save() { saveDraft({ text: ct.value, name: cn.value, village: cv.value }); }
        ct.addEventListener("input", save); cn.addEventListener("input", save); cv.addEventListener("change", save);
        document.getElementById("cf").addEventListener("submit", function (e) {
          e.preventDefault();
          if (!ct.value.trim()) { res.innerHTML = '<div class="msg err">اكتب نص الشكوى أولاً.</div>'; return; }
          if (!cc.checked) { res.innerHTML = '<div class="msg err">يلزم الموافقة على المراجعة قبل النشر.</div>'; return; }
          save();
          res.innerHTML = '<div class="msg ok">النموذج سليم. هذه نسخة تجريبية فلم تُرسل الشكوى، ومسودتك محفوظة على هاتفك.</div>';
        });
      }
    };
  }

  function pageSearch(query) {
    var q0 = param(query, "q");
    var html = '<form id="sf"><input type="search" id="sq" placeholder="ابحث في الخدمات والإعلانات" value="' + esc(q0) + '"></form><div id="list"></div>';
    return {
      title: "البحث", back: "#/", html: html,
      after: function () {
        var sq = document.getElementById("sq"), list = document.getElementById("list");
        function draw() {
          var t = norm(sq.value), out = "", n = 0, i;
          if (!t) { list.innerHTML = '<p class="empty">اكتب كلمة للبحث.</p>'; return; }
          var sv = "", ad = "";
          for (i = 0; i < D.services.length; i++) {
            var s = D.services[i];
            if (has(s.name, t) || has(s.desc, t) || has(nameOf(D.serviceTypes, s.type), t) || has(nameOf(D.villages, s.village), t)) { sv += serviceCard(s); n++; }
          }
          for (i = 0; i < D.ads.length; i++) {
            var a = D.ads[i];
            if (has(a.title, t) || has(a.desc, t) || has(nameOf(D.adCategories, a.category), t) || has(nameOf(D.villages, a.village), t)) { ad += adCard(a); n++; }
          }
          if (sv) { out += "<h2>الخدمات</h2>" + sv; }
          if (ad) { out += "<h2>الإعلانات</h2>" + ad; }
          list.innerHTML = out || '<p class="empty">لا توجد نتائج مطابقة.</p>';
        }
        sq.addEventListener("input", draw);
        document.getElementById("sf").addEventListener("submit", function (e) { e.preventDefault(); draw(); });
        draw();
      }
    };
  }

  function pageAbout() {
    var html = demo() + "<h2>دليل قريتي</h2>" +
      "<p>دليل محلي يجمع خدمات القرية والقرى المجاورة وإعلاناتها وصورها وشكاوى أهلها.</p>" +
      "<p>الإدارة هي التي تضيف المعلومات وتراجع كل صورة أو شكوى قبل نشرها.</p>" +
      '<p class="note">طريقة التواصل مع الإدارة ستُضاف هنا لاحقاً.</p>';
    var m = D.meta || {};
    html += "<h2>معلومات للاختبار</h2>" +
      '<p class="muted">مصدر البيانات: ' + (m.source === "indexeddb" ? "تخزين الهاتف (IndexedDB)" : "ذاكرة مؤقتة (التخزين غير متاح في هذا المتصفح)") + "</p>" +
      (m.opens ? '<p class="muted">عدد مرات فتح التطبيق على هذا الهاتف: ' + esc(m.opens) + "</p>" : "") +
      (m.seededAt ? '<p class="muted">وقت تحميل البيانات التجريبية: ' + esc(m.seededAt.slice(0, 10)) + "</p>" : "") +
      '<p class="muted">السجلات: خدمات ' + D.services.length + " · إعلانات " + D.ads.length + " · صور " + D.photos.length + " · خطوط " + D.routes.length + "</p>";
    return { title: "عن التطبيق", back: "#/", html: html };
  }
  function pageNotFound(back) {
    return { title: "غير موجود", back: back || "#/", html: '<p class="empty">هذه الصفحة غير موجودة.</p><div class="actions"><a class="btn" href="#/">الرئيسية</a></div>' };
  }

  // ---------- التوجيه ----------
  function route() {
    if (!D) { return; }
    var raw = location.hash.replace(/^#\/?/, "");
    var qi = raw.indexOf("?");
    var path = qi === -1 ? raw : raw.slice(0, qi);
    var query = qi === -1 ? "" : raw.slice(qi + 1);
    var parts = path.split("/");
    var page;
    switch (parts[0]) {
      case "": page = pageHome(); break;
      case "services": page = pageServices(); break;
      case "service": page = pageService(parts[1]); break;
      case "ads": page = pageAds(false); break;
      case "ad": page = pageAd(parts[1]); break;
      case "jobs": page = pageAds(true); break;
      case "transport": page = pageTransport(); break;
      case "album": page = pageAlbum(query); break;
      case "photo": page = pagePhoto(parts[1]); break;
      case "send-photo": page = pageSendPhoto(); break;
      case "complaints": page = parts[1] === "new" ? pageComplaintNew() : pageComplaints(); break;
      case "search": page = pageSearch(query); break;
      case "about": page = pageAbout(); break;
      default: page = pageNotFound("#/");
    }
    titleEl.textContent = page.title;
    document.title = page.title === "دليل قريتي" ? "دليل قريتي" : page.title + " - دليل قريتي";
    if (page.back) { backEl.hidden = false; backEl.setAttribute("href", page.back); } else { backEl.hidden = true; }
    view.innerHTML = page.html;
    if (page.after) { page.after(); }
    window.scrollTo(0, 0);
  }

  function updateNet() { offlineEl.hidden = navigator.onLine; }
  window.addEventListener("online", updateNet);
  window.addEventListener("offline", updateNet);
  window.addEventListener("hashchange", route);
  updateNet();

  // نحمّل البيانات من تخزين الهاتف أولاً، ثم نعرض الصفحة
  window.Store.init(window.DATA).then(function (data) {
    D = data;
    route();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* يعمل التطبيق بدونه لكن دون وضع عدم الاتصال */ });
  }
})();
