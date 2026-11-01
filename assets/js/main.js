/* 网站功能 / Site behaviour — 一般不需要改 / normally no need to edit */
(function () {
  /* 内容来自 data 文件夹里的 JSON 文件（可以用 Pages CMS 编辑）
     Content comes from the JSON files in the data folder (editable with Pages CMS) */
  var S;
  /* 每分钟换一个参数，避免浏览器和 GitHub 用旧内容 / a per-minute token so browsers and GitHub don't serve stale content */
  function load(name) {
    return fetch("data/" + name + ".json?t=" + Math.floor(Date.now() / 60000), { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(name); return r.json(); });
  }
  var SECTIONS = ["craft", "material", "others"];   /* 菜单分区的顺序 / order of the menu sections */
  function slug(x) { return String(x || "").toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, ""); }
  function build(site, projects, materials, about) {
    var s = site; s.projects = (projects && projects.works) || projects || []; s.materials = materials || []; s.about = about || {};
    s.contact = s.contact || {}; s.research = s.research || {};
    /* 标签直接写在每个项目里，这里汇总成筛选按钮 / tags live on each project; collect them for the filters */
    s.tags = {};
    s.projects.forEach(function (p, i) {
      /* 作品名称：中文 title + 英文 title_en / project title: Chinese "title" + English "title_en" */
      if (typeof p.title === "string" || p.title_en) p.title = { zh: p.title || p.title_en || "", en: p.title_en || p.title || "" };
      p.id = p.id || slug(p.title && p.title.en) || "project-" + (i + 1);
      p.images = (p.images || []).filter(Boolean);
      p.tags = (p.tags || []).map(function (tg) {
        var k = slug(tg.en || tg.zh); if (k) s.tags[k] = s.tags[k] || tg; return k;
      }).filter(Boolean);
    });
    s.featured = (s.featured || []).map(function (f) { return slug(f); });
    /* 作品分区：工艺探索 / 材料探索 / 其他（名称可在 Pages CMS 的网站设置里改）
       Works sections: Craft / Material / Others (names editable in Site settings) */
    s.sections = s.sections || {};
    SECTIONS.forEach(function (k) {
      var v = s.sections[k] || {};
      s.sections[k] = { zh: v.zh || UI[k].zh, en: v.en || UI[k].en };
    });
    var OLD = { fashion: "craft", process: "others" };
    s.projects = s.projects.filter(function (p) { return !p.draft; });   /* 草稿不显示 / drafts stay hidden */
    s.projects.forEach(function (p) {
      p.section = OLD[p.section] || p.section;
      if (SECTIONS.indexOf(p.section) < 0) p.section = "others";
    });
    return s;
  }

  /* ---------- 界面文字 / Interface text ---------- */
  var UI = {
    works:      { zh: "作品", en: "Works" },
    craft:      { zh: "工艺探索", en: "Craft Exploration" },
    material:   { zh: "材料探索", en: "Material Exploration" },
    others:     { zh: "其他", en: "Others" },
    soon:       { zh: "内容即将更新。", en: "Coming soon." },
    close:      { zh: "关闭", en: "Close" },
    research:   { zh: "研究", en: "Research" },
    about:      { zh: "关于", en: "About" },
    all:        { zh: "全部", en: "All" },
    selected:   { zh: "精选作品", en: "Selected Works" },
    viewAll:    { zh: "查看全部作品", en: "View all works" },
    back:       { zh: "返回作品", en: "Back to works" },
    year:       { zh: "年份", en: "Year" },
    category:   { zh: "类别", en: "Category" },
    materials:  { zh: "材料", en: "Materials" },
    next:       { zh: "下一个项目", en: "Next project" },
    notFound:   { zh: "没有找到这个项目。", en: "Project not found." },
    contact:    { zh: "联系", en: "Contact" },
    education:  { zh: "教育背景", en: "Education" },
    exhibitions:{ zh: "展览与奖项", en: "Exhibitions & Awards" },
    sample:     { zh: "示例", en: "Sample" },
    collected:  { zh: "收集时间", en: "Collected" },
    location:   { zh: "收集地点", en: "Location" },
    source:     { zh: "来源", en: "Source" },
    composition:{ zh: "成分", en: "Composition" },
    properties: { zh: "特性", en: "Properties" },
    processing: { zh: "加工方式", en: "Processing" },
    endOfLife:  { zh: "循环 / 生命周期末端", en: "Circularity / end of life" },
    notes:      { zh: "备注", en: "Notes" },
    entries:    { zh: "条记录", en: "entries" },
    image:      { zh: "图片", en: "Image" },
    discover:   { zh: "了解这个项目", en: "Discover the project" },
    moreWorks:  { zh: "更多作品", en: "More Works" },
    prev:       { zh: "上一张", en: "Previous" },
    nextSlide:  { zh: "下一张", en: "Next" },
    skip:       { zh: "进入", en: "Enter" }
  };

  /* ---------- 语言 / Language ---------- */
  function getLang() {
    var p = new URLSearchParams(location.search).get("lang");
    if (p === "zh" || p === "en") return p;
    try { var s = localStorage.getItem("lang"); if (s) return s; } catch (e) {}
    return "en";
  }
  var lang = getLang();
  function setLang(l) {
    try { localStorage.setItem("lang", l); } catch (e) {}
    lang = l; render();
  }
  function t(obj) {
    if (obj == null) return "";
    if (typeof obj === "string" || typeof obj === "number") return String(obj);
    return obj[lang] || obj.en || obj.zh || "";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function paras(text) {
    return esc(text).split(/\n\s*\n/).map(function (p) { return "<p>" + p + "</p>"; }).join("");
  }

  /* 图片：文件还没上传时显示灰色占位 / Grey placeholder until the image is uploaded */
  function img(src, alt, cls) {
    /* 还没有图片时显示灰色占位框 / grey placeholder when there's no image yet */
    if (!src) return '<div class="ph missing ' + (cls || "") + '"></div>';
    return '<div class="ph ' + (cls || "") + '"><img src="' + esc(src) + '" alt="' + esc(alt) +
      '" loading="lazy" onerror="this.parentNode.classList.add(\'missing\');this.remove()"></div>';
  }

  function videoEmbed(url) {
    if (!url) return "";
    var m, src = "";
    if ((m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/))) src = "https://www.youtube-nocookie.com/embed/" + m[1];
    else if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) src = "https://player.vimeo.com/video/" + m[1];
    if (!src) return "";
    return '<div class="video"><iframe src="' + src + '" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="video"></iframe></div>';
  }

  function projectUrl(id) { return "project.html?id=" + encodeURIComponent(id); }

  /* ---------- 页头页脚 / Header & footer ---------- */
  /* 虚线描边字（像缝纫线迹）/ Dashed outline lettering, like stitching */
  function stitch(text) {
    return '<svg class="stitch" aria-hidden="true" focusable="false"><text x="0" y="0">' + esc(String(text).toUpperCase()) + "</text></svg>" +
      '<span class="sr">' + esc(text) + "</span>";
  }
  var _cv;
  function fitStitches() {
    _cv = _cv || document.createElement("canvas").getContext("2d");
    document.querySelectorAll("svg.stitch").forEach(function (svg) {
      var tx = svg.querySelector("text:not(.cut)"), w;
      try { w = tx.getComputedTextLength(); } catch (e) { return; }
      /* 量出字形真实的上下边界，让对齐精确 / measure the real glyph edges for exact alignment */
      var cs = getComputedStyle(tx);
      _cv.font = cs.fontWeight + " 100px " + cs.fontFamily;
      var m = _cv.measureText(tx.textContent);
      var top = m.actualBoundingBoxAscent || 72, bottom = m.actualBoundingBoxDescent || 0;
      var hh = top + bottom;
      svg.setAttribute("viewBox", "0 " + (-top) + " " + w + " " + hh);
      svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
      /* 直接写明宽度，Safari 不会自动按比例算 / set the width explicitly; Safari won't derive it */
      svg.style.width = "calc(var(--h) * " + (w / hh).toFixed(4) + ")";
    });
  }

  function header(page) {
    var links = [["works", "works.html"], ["research", "research.html"], ["about", "about.html"]];
    return '<div class="lang"><button data-lang="en"' + (lang === "en" ? ' class="on"' : "") + '>EN</button>' +
      '<span aria-hidden="true">/</span><button data-lang="zh"' + (lang === "zh" ? ' class="on"' : "") + ">中文</button></div>" +
      '<div class="header-inner"><a class="brand" href="index.html">' + stitch(S.name.en) + "</a>" +
      '<nav class="nav">' + links.map(function (l) {
        var on = page === l[0] || (page === "project" && l[0] === "works");
        var a = '<a href="' + l[1] + '"' + (on ? ' class="active" aria-current="page"' : "") + ">" + stitch(t(UI[l[0]])) + '<i class="bar"></i></a>';
        return l[0] === "works" ? '<div class="nav-item has-menu">' + a + worksMenu() + "</div>" : a;
      }).join("") + "</nav></div>";
  }
  /* 鼠标移到 WORKS 时出现的下拉菜单 / dropdown shown when hovering WORKS */
  function worksMenu() {
    function group(k) {
      var items = sortedProjects().filter(function (p) { return p.section === k; });
      return '<li><a class="menu-head" href="works.html?section=' + k + '">' + esc(t(S.sections[k])) + "</a>" +
        (items.length ? '<ul class="menu-sub">' + items.map(function (p) {
          return '<li><a href="' + projectUrl(p.id) + '">' + esc(t(p.title)) + "</a></li>";
        }).join("") + "</ul>" : "") + "</li>";
    }
    return '<div class="menu"><ul><li><a class="menu-head" href="works.html">' + t(UI.all) + "</a></li>" +
      SECTIONS.map(group).join("") + "</ul></div>";
  }
  function footer() {
    var c = S.contact, items = [];
    if (c.email) items.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>");
    if (c.instagram) items.push('<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a>');
    if (c.linkedin) items.push('<a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    return "<span>© " + new Date().getFullYear() + " " + esc(S.name.en) + " " + esc(S.name.zh) + ' <i class="ver">v2.8</i></span>' +
      (items.length ? '<span class="links">' + items.join("") + "</span>" : "");
  }

  /* ---------- 作品卡片 / Project card ---------- */
  function card(p) {
    return '<a class="card" href="' + projectUrl(p.id) + '">' + img(p.cover, t(p.title), "ratio-45") +
      '<div class="card-meta"><h3>' + esc(t(p.title)) + "</h3><span>" + esc(p.year) + "</span></div>" +
      '<p class="card-sub">' + esc(t(p.category)) + "</p></a>";
  }
  function sortedProjects() {
    return S.projects.slice().sort(function (a, b) { return b.year - a.year; });
  }

  /* 每套 Look 一行展示窗口；没有图片时先显示占位框
     One row of image windows per look; placeholders until photos are added */
  function looks(p) {
    var L = (p.looks || []).filter(function (l) { return l && (l.name || (l.images || []).length); });
    if (!L.length) return "";
    return '<section class="looks">' + L.map(function (l) {
      var pics = (l.images || []).filter(Boolean);
      var cells = pics.length ? pics.map(function (src) { return img(src, t(p.title) + " " + (l.name || ""), "zoomable"); }).join("")
                              : '<div class="ph missing"></div><div class="ph missing"></div><div class="ph missing"></div>';
      return '<div class="look"><h2 class="look-name">' + esc(l.name || "") + '</h2><div class="look-grid">' + cells + "</div></div>";
    }).join("") + "</section>";
  }

  /* 点击图片看完整大图 / click an image to see it whole */
  function wireLightbox() {
    var imgs = [].slice.call(document.querySelectorAll("#app .zoomable img"));
    imgs.forEach(function (im, i) {
      im.parentNode.onclick = function () { openBox(imgs.map(function (x) { return x.src; }), i); };
    });
  }
  function openBox(list, i) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<img alt=""><button class="lb-close" aria-label="' + t(UI.close) + '">×</button>' +
      (list.length > 1 ? '<button class="lb-prev" aria-label="' + t(UI.prev) + '"></button><button class="lb-next" aria-label="' + t(UI.nextSlide) + '"></button>' : "");
    var pic = box.querySelector("img");
    function show(k) { i = (k + list.length) % list.length; pic.src = list[i]; }
    function close() { box.remove(); document.removeEventListener("keydown", key); document.body.classList.remove("no-scroll"); }
    function key(e) { if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); }
    box.onclick = function (e) {
      if (e.target.classList.contains("lb-next")) show(i + 1);
      else if (e.target.classList.contains("lb-prev")) show(i - 1);
      else if (e.target !== pic) close();
    };
    document.addEventListener("keydown", key);
    document.body.appendChild(box); document.body.classList.add("no-scroll");
    show(i);
  }

  /* ---------- 各页面 / Pages ---------- */
  var pages = {
    home: function () {
      var all = sortedProjects();
      var feat = (S.featured && S.featured.length) ? S.featured.map(function (id) {
        return all.filter(function (p) { return p.id === id; })[0];
      }).filter(Boolean) : all.filter(function (p) { return p.section !== "others"; });
      /* 每个项目一组可左右翻的图片，下面是项目名称链接
         One swipeable row of images per project, with the project title link below */
      return feat.map(function (p) {
          var pics = [p.cover].concat(p.images || []).filter(Boolean);
          while (pics.length < 4) pics.push("");   /* 图片不够时用占位框补齐一排 / pad the row with placeholders */
          return '<section class="showcase">' +
            '<div class="slider"><div class="track">' + pics.map(function (src) {
              return '<a class="slide" href="' + projectUrl(p.id) + '">' + img(src, t(p.title), "") + "</a>";
            }).join("") + "</div>" +
            '<button class="arrow prev" aria-label="' + t(UI.prev) + '"></button>' +
            '<button class="arrow next-btn" aria-label="' + t(UI.nextSlide) + '"></button></div>' +
            '<a class="btn showcase-link" href="' + projectUrl(p.id) + '">' + esc(t(p.title)) +
            ' <span>' + esc(p.year) + "</span></a></section>";
        }).join("") +
        '<p class="all-link"><a href="works.html">' + t(UI.viewAll) + " →</a></p>";
    },

    works: function () {
      var q = new URLSearchParams(location.search);
      var sec = q.get("section"), tag = q.get("tag");
      if (SECTIONS.indexOf(sec) < 0) sec = "all";
      function f(k, href, label) {
        return '<a href="' + href + '"' + (!tag && sec === k ? ' class="on"' : "") + ">" + esc(label) + "</a>";
      }
      var filters = '<div class="filters">' + f("all", "works.html", t(UI.all)) +
        SECTIONS.map(function (k) { return f(k, "works.html?section=" + k, t(S.sections[k])); }).join("") +
        (tag && S.tags[tag] ? '<a class="on" href="works.html?tag=' + tag + '">#' + esc(t(S.tags[tag])) + "</a>" : "") + "</div>";
      var list = sortedProjects().filter(function (p) {
        if (tag) return (p.tags || []).indexOf(tag) > -1;
        return sec === "all" || p.section === sec;
      });
      return '<section class="page-head"><h1>' + t(UI.works) + "</h1>" + filters + "</section>" +
        (list.length ? '<div class="grid">' + list.map(card).join("") + "</div>" : '<p class="empty">' + t(UI.soon) + "</p>");
    },

    project: function () {
      var id = new URLSearchParams(location.search).get("id");
      var list = sortedProjects();
      var i = list.findIndex(function (p) { return p.id === id; });
      if (i < 0) return '<p class="empty">' + t(UI.notFound) + ' <a href="works.html">' + t(UI.back) + "</a></p>";
      var p = list[i], next = list[(i + 1) % list.length];
      document.title = t(p.title) + " — " + t(S.name);
      var tags = (p.tags || []).map(function (k) {
        return S.tags[k] ? '<a href="works.html?tag=' + k + '">' + esc(t(S.tags[k])) + "</a>" : "";
      }).join("");
      return '<a class="back" href="works.html">← ' + t(UI.back) + "</a>" +
        '<article class="project"><header class="project-head"><h1>' + esc(t(p.title)) + "</h1>" +
        (lang === "zh" && p.title.en !== p.title.zh ? '<p class="alt-title">' + esc(p.title.en) + "</p>" : "") +
        (lang === "en" && p.title.en !== p.title.zh ? '<p class="alt-title">' + esc(p.title.zh) + "</p>" : "") + "</header>" +
        img(p.cover, t(p.title), "ratio-wide pan zoomable") +
        '<div class="project-body"><dl class="facts"><div><dt>' + t(UI.year) + "</dt><dd>" + esc(p.year) + "</dd></div>" +
        "<div><dt>" + t(UI.category) + "</dt><dd>" + esc(t(p.category)) + "</dd></div>" +
        (p.materials ? "<div><dt>" + t(UI.materials) + "</dt><dd>" + esc(t(p.materials)) + "</dd></div>" : "") +
        (tags ? '<div class="tags">' + tags + "</div>" : "") + "</dl>" +
        '<div class="prose">' + paras(t(p.description)) + "</div></div>" +
        looks(p) +
        videoEmbed(p.video) +
        ((p.images || []).length ? '<div class="gallery">' + p.images.map(function (s) { return img(s, t(p.title), "zoomable"); }).join("") + "</div>" : "") +
        "</article>" +
        (next && next.id !== p.id ? '<a class="next" href="' + projectUrl(next.id) + '"><span>' + t(UI.next) + "</span><strong>" + esc(t(next.title)) + " →</strong></a>" : "");
    },

    research: function () {
      var fields = ["collected", "location", "source", "composition", "properties", "processing", "endOfLife", "notes"];
      var items = S.materials.map(function (m) {
        return '<article class="material">' + img(m.image, t(m.name), "ratio-sq") +
          '<div class="material-body"><div class="material-head"><span class="mid">' + esc(m.id) + "</span>" +
          (m.sample ? '<span class="badge">' + t(UI.sample) + "</span>" : "") + "</div>" +
          "<h3>" + esc(t(m.name)) + '</h3><p class="card-sub">' + esc(t(m.category)) + "</p>" +
          '<dl class="mfields">' + fields.filter(function (f) { return m[f]; }).map(function (f) {
            return "<div><dt>" + t(UI[f]) + "</dt><dd>" + esc(t(m[f])) + "</dd></div>";
          }).join("") + "</dl></div></article>";
      }).join("");
      return '<section class="page-head"><h1>' + esc(t(S.research.title)) + '</h1><p class="lead small">' + esc(t(S.research.intro)) + "</p>" +
        '<p class="count">' + S.materials.length + " " + t(UI.entries) + "</p></section>" +
        '<div class="materials">' + items + "</div>";
    },

    about: function () {
      var a = S.about, c = S.contact;
      function list(title, rows) {
        if (!rows || !rows.length) return "";
        return '<section class="cv"><h2>' + t(title) + "</h2><ul>" + rows.map(function (r) {
          return "<li><span>" + esc(r.year) + "</span><span>" + esc(t(r.text)) + "</span></li>";
        }).join("") + "</ul></section>";
      }
      var contacts = [];
      if (c.email) contacts.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>");
      if (c.instagram) contacts.push('<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a>');
      if (c.linkedin) contacts.push('<a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
      return '<section class="page-head"><h1>' + t(UI.about) + "</h1></section>" +
        '<div class="about"><div class="prose big">' + paras(t(a.bio)) + "<p>" + esc(t(a.phd)) + "</p></div>" +
        '<div class="about-side">' + list(UI.education, a.education) + list(UI.exhibitions, a.exhibitions) +
        (contacts.length ? '<section class="cv"><h2>' + t(UI.contact) + '</h2><p class="contact">' + contacts.join("<br>") + "</p></section>" : "") +
        "</div></div>";
    }
  };

  /* ---------- 渲染 / Render ---------- */
  function render() {
    var page = document.body.getAttribute("data-page");
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.getElementById("site-header").innerHTML = header(page);
    document.getElementById("app").innerHTML = pages[page] ? pages[page]() : "";
    document.getElementById("site-footer").innerHTML = footer();
    if (page !== "project") document.title = (page === "home" ? "" : t(UI[page]) + " — ") + t(S.name);

    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.onclick = function () { setLang(b.getAttribute("data-lang")); };
    });
  }
  /* 轮播箭头 / Slider arrows */
  function wireSlider() {
    document.querySelectorAll(".slider").forEach(function (sl) {
      var track = sl.querySelector(".track"), prev = sl.querySelector(".prev"), next = sl.querySelector(".next-btn");
      function step(dir) {
        var slide = track.querySelector(".slide");
        var w = slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
        track.scrollBy({ left: dir * w, behavior: "smooth" });
      }
      prev.onclick = function () { step(-1); };
      next.onclick = function () { step(1); };
      function update() {
        var max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
      }
      track.onscroll = update; window.addEventListener("resize", update); update();
    });
  }

  /* 开屏动画 / Animated intro screen
     名字像被缝出来一样从左到右出现，然后中文名淡入，最后淡出进入首页
     The name is "sewn" from left to right, the Chinese name fades in, then the screen fades away */
  function splash() {
    var cfg = S.splash || {};
    if (!cfg.enabled || document.body.getAttribute("data-page") !== "home") return;
    try { if (sessionStorage.getItem("introSeen")) return; sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    var media = cfg.video ? '<video src="' + esc(cfg.video) + '" autoplay muted playsinline preload="auto"' + (cfg.image ? ' poster="' + esc(cfg.image) + '"' : "") + "></video>" :
      (cfg.image ? '<img src="' + esc(cfg.image) + '" alt="" onerror="this.parentNode.classList.remove(\'has-media\');this.remove()">' : "");
    var el = document.createElement("div");
    el.className = "splash" + (media ? " has-media" : "");
    el.innerHTML = media +
      '<div class="splash-name"><div class="sew">' +
      '<svg class="stitch" aria-hidden="true" focusable="false"><defs><mask id="sewMask" maskUnits="userSpaceOnUse" x="-50" y="-300" width="5000" height="600">' +
      '<rect class="sew-reveal" x="-50" y="-300" width="5000" height="600" fill="#fff"/>' +
      /* 挖掉字的内部，只留外轮廓，背景是视频也很干净 / cut out the letter insides so only the outline shows, even over video */
      '<text class="cut" x="0" y="0">' + esc(S.name.en.toUpperCase()) + "</text></mask></defs>" +
      '<text x="0" y="0" mask="url(#sewMask)">' + esc(S.name.en.toUpperCase()) + "</text></svg>" +
      '<span class="needle"></span></div>' +
      '<span class="splash-sub">' + esc(S.name.zh) + "</span></div>" +
      '<button class="splash-skip">' + t(UI.skip) + " ↓</button>";
    if (media) {
      el.style.setProperty("--sew-delay", (cfg.sewDelay || 0) + "s");
      el.style.setProperty("--dim-delay", (cfg.dimDelay || 0) + "s");
      el.style.setProperty("--dim-time", (cfg.dimTime || 1.5) + "s");
      el.style.setProperty("--dim", cfg.dim == null ? 0.6 : cfg.dim);
      el.style.setProperty("--blur", (cfg.blur == null ? 10 : cfg.blur) + "px");
    }
    document.body.appendChild(el);
    document.body.classList.add("no-scroll");
    var vid = el.querySelector("video");
    if (vid) {
      vid.playbackRate = cfg.videoSpeed || 1;
      vid.addEventListener("loadedmetadata", function () { vid.playbackRate = cfg.videoSpeed || 1; });
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    }
    fitStitches();
    /* 遮罩宽度按名字的实际长度设置 / size the reveal to the name's real width */
    try {
      var vb = el.querySelector("svg").viewBox.baseVal;
      var r = el.querySelector(".sew-reveal");
      r.setAttribute("x", vb.x - 10); r.setAttribute("width", vb.width + 20);
    } catch (e) {}
    /* 等照片加载好再开始动画，最多等 1.5 秒 / start once the photo has loaded, waiting at most 1.5s */
    var started = false;
    function start() {
      if (started) return; started = true;
      requestAnimationFrame(function () { el.classList.add("play"); });
      setTimeout(close, (cfg.seconds || 3.8) * 1000);
    }
    var im = el.querySelector("img");
    if (im && !im.complete) { im.addEventListener("load", start); im.addEventListener("error", start); setTimeout(start, 1500); }
    else start();
    var done = false;
    function close() {
      if (done) return; done = true;
      el.classList.add("out"); document.body.classList.remove("no-scroll");
      setTimeout(function () { el.remove(); }, 1000);
    }
    el.onclick = close;
    window.addEventListener("wheel", close, { once: true, passive: true });
    window.addEventListener("touchmove", close, { once: true, passive: true });
    el.querySelector(".splash-skip").onclick = close;
  }

  var _render = render;
  render = function () { _render(); wireSlider(); wireLightbox(); fitStitches(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStitches);
  Promise.all(["site", "projects", "materials", "about"].map(load)).then(function (d) {
    S = build(d[0], d[1], d[2], d[3]);
    render();
    splash();
  }).catch(function () {
    document.getElementById("app").innerHTML = '<p class="empty">' +
      "内容没有加载出来。如果你是直接双击打开的本地文件，请在线上网站查看。<br>" +
      "Content couldn't load. If you opened this file directly from your computer, please view it on the live site.</p>";
  });
})();
