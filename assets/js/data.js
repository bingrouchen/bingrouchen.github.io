/* ============================================================
   网站内容 / Site content
   ------------------------------------------------------------
   以后改文字、加项目、加材料，都只改这个文件。
   To edit text or add projects/materials, only edit this file.
   每段文字都有 zh（中文）和 en（英文）两个版本。
   Every piece of text has a zh (Chinese) and en (English) version.
   ============================================================ */

window.SITE = {

  /* ---------- 基本信息 / Basics ---------- */
  name: { zh: "陈冰柔", en: "Bingrou Chen" },
  intro: {
    zh: "设计师、博士研究生，探索时装与纺织品的更多可能。",
    en: "Designer and PhD student exploring new possibilities in fashion and textiles."
  },

  /* 开屏页面 / Intro screen
     image：全屏背景图；video：可选，短的 .mp4 视频（建议 10MB 以内，会静音循环播放）
     image: full-screen background; video: optional short .mp4 (under ~10MB, plays muted)
     seconds：停留几秒后自动淡出 / how many seconds before it fades out
     enabled：false 可以关掉开屏 / set to false to turn the intro off */
  splash: {
    enabled: true,
    image: "images/splash.jpg",
    video: "",
    seconds: 3
  },

  /* 首页轮播：按顺序填项目 id，留空 [] 就显示全部
     Home slider: project ids in order, or [] to show all */
  featured: [],

  /* 首页介绍的项目（一般是最新作品）/ Project introduced on the home page (usually the latest) */
  heroProject: "the-shape-of-old-memory",

  /* 联系方式：不想公开的留空 "" 即可 / Leave "" to hide */
  contact: {
    email: "",
    instagram: "",   // 例如 / e.g. "https://instagram.com/yourname"
    linkedin: ""
  },

  /* ---------- 标签 / Tags ---------- */
  tags: {
    collection: { zh: "服装系列", en: "Fashion Collection" },
    material:   { zh: "材料",     en: "Material" },
    knitting:   { zh: "编织",     en: "Knitting" },
    craft:      { zh: "传统工艺", en: "Traditional Craft" }
  },

  /* ---------- 作品 / Works ----------
     加新项目：复制一整段 { ... }，改 id 和内容。
     To add a project: copy a whole { ... } block and change the id and content.
     图片放在 images/projects/项目id/ 文件夹里，文件名和下面对应即可。
     Put images in images/projects/<project id>/ using the file names below.
     video：YouTube 或 Vimeo 链接，没有就留空 ""。
     video: a YouTube or Vimeo link, or "" for none. */
  projects: [
    {
      id: "no-angle",
      title: { zh: "NO ANGLE", en: "NO ANGLE" },
      year: 2019,
      category: { zh: "服装系列", en: "Fashion Collection" },
      tags: ["collection", "material", "knitting"],
      cover: "images/projects/no-angle/cover.jpg",
      images: [
        "images/projects/no-angle/01.jpg",
        "images/projects/no-angle/02.jpg",
        "images/projects/no-angle/03.jpg",
        "images/projects/no-angle/04.jpg",
        "images/projects/no-angle/05.jpg"
      ],
      video: "",
      summary: {
        zh: "用橡皮圈、金属环和透明亚克力球编织成的可穿戴雕塑。",
        en: "Wearable sculpture knitted from rubber bands, metal rings and clear acrylic spheres."
      },
      description: {
        zh: "NO ANGLE 其实是一种新的角度，打破了服装设计固有的定义，以及不同材料使用性质之间的分界线。\n\n这件作品以创意编织的方式，把普通橡皮圈、金属环和透明亚克力球这些“非服用”材料编织成可穿戴的服装。它既优雅又极具雕塑感，带来一种与众不同的美的体验，也为服装设计打开了新的可能。",
        en: "NO ANGLE is, in fact, a new angle, one that breaks the fixed definitions of fashion design and the boundaries between how different materials are used.\n\nThrough creative knitting, ordinary rubber bands, metal rings and clear acrylic spheres, materials never meant to be worn, are transformed into wearable garments. Both elegant and strongly sculptural, the work offers a distinctive experience of beauty and opens up new possibilities for fashion design."
      },
      materials: {
        zh: "橡皮圈、金属环、透明亚克力球",
        en: "Rubber bands, metal rings, clear acrylic spheres"
      }
    },
    {
      id: "the-shape-of-old-memory",
      title: { zh: "陈迹·新渊", en: "The Shape of Old Memory" },
      year: 2022,
      category: { zh: "服装系列", en: "Fashion Collection" },
      tags: ["collection", "material", "craft"],
      cover: "images/projects/the-shape-of-old-memory/cover.jpg",
      images: [
        "images/projects/the-shape-of-old-memory/01.jpg",
        "images/projects/the-shape-of-old-memory/02.jpg",
        "images/projects/the-shape-of-old-memory/03.jpg",
        "images/projects/the-shape-of-old-memory/04.jpg",
        "images/projects/the-shape-of-old-memory/05.jpg"
      ],
      video: "",
      summary: {
        zh: "以金属珠链与环氧树脂“打捞”潮绣图案的毕业系列。",
        en: "A graduation collection that “salvages” Chaozhou embroidery through metal bead chains and epoxy resin."
      },
      description: {
        zh: "传统工艺就像沉在深海里的宝藏：我们知道它存在，也知道它珍贵，却很少真正触碰到它。\n\n在这个毕业系列中，我把潮绣作为“打捞”的对象，提取经典潮绣作品中的人物图案进行拆解重组，再用金属珠链掐绕出图案的残迹，封存在环氧树脂滴胶之下。潮绣元素因此呈现出似近似远、看得见却摸不着的状态，隐喻它在当代大多数人心中的位置。\n\n这个系列并不追求复刻传统，而是探索传统工艺在当代设计中新的可能，赋予它新的生命力。",
        en: "Traditional craft is like treasure sunk in the deep sea: we sense its presence and its value, yet rarely reach it.\n\nIn this graduation collection, I set out to “salvage” Chaozhou embroidery. I extracted figurative motifs from classic Chaozhou embroidery works, deconstructed and recomposed them, then coiled metal bead chains into traces of these patterns and sealed them beneath epoxy resin. The embroidery appears near yet distant, visible yet out of reach, a metaphor for how it exists in most people’s minds today.\n\nRather than replicating tradition, the collection explores how traditional craft can be reimagined in contemporary design, giving it new life."
      },
      materials: {
        zh: "金属珠链、环氧树脂滴胶",
        en: "Metal bead chains, epoxy resin"
      }
    }
  ],

  /* ---------- 研究：材料库 / Research: material library ----------
     字段参考欧盟数字产品护照（DPP）与材料护照框架。
     Fields are informed by the EU Digital Product Passport and material passport frameworks.
     下面这一条是示例，换成真实材料后把 sample 改成 false 或删掉这一行。
     The entry below is a sample. Replace it with a real material and remove the "sample" line. */
  research: {
    title: { zh: "材料库", en: "Material Library" },
    intro: {
      zh: "这里记录我在博士研究中收集的材料。每种材料都有一份“材料档案”，参考欧盟数字产品护照的框架，记录它的来源、成分、特性与循环信息。",
      en: "A record of the materials collected during my PhD research. Each material has its own record, informed by the EU Digital Product Passport framework, documenting its origin, composition, properties and circularity."
    }
  },

  materials: [
    {
      id: "M-001",
      sample: true,
      name: { zh: "示例材料", en: "Sample Material" },
      category: { zh: "回收纤维", en: "Recycled fibre" },
      image: "images/materials/M-001.jpg",
      collected: "2026-03",
      location: { zh: "新西兰 奥克兰", en: "Auckland, New Zealand" },
      source: { zh: "来源 / 供应方", en: "Source / supplier" },
      composition: { zh: "成分，例如 80% 羊毛、20% 聚酯", en: "Composition, e.g. 80% wool, 20% polyester" },
      properties: { zh: "特性：手感、强度、颜色等", en: "Properties: hand feel, strength, colour, etc." },
      processing: { zh: "加工方式", en: "Processing" },
      endOfLife: { zh: "可回收 / 可降解 / 可再利用", en: "Recyclable / biodegradable / reusable" },
      notes: { zh: "备注", en: "Notes" }
    }
  ],

  /* ---------- 关于我 / About ---------- */
  about: {
    bio: {
      zh: "陈冰柔是一名时装与纺织品设计师，目前在读博士。她的创作关注材料本身，通过编织、封存等方式，把日常材料和传统工艺转化为新的穿着体验。",
      en: "Bingrou Chen is a fashion and textile designer and PhD student. Her practice centres on materials themselves, transforming everyday materials and traditional craft into new wearable experiences through techniques such as knitting and encapsulation."
    },
    phd: {
      zh: "博士课题：（待补充）",
      en: "PhD research: (to be added)"
    },
    /* 每一行一条经历 / One line per entry */
    education: [
      { year: "—", text: { zh: "博士，学校名称（待补充）", en: "PhD, University name (to be added)" } }
    ],
    exhibitions: []
  }
};
