function on(eventType, element, obj, fn) {
  if (!(element instanceof Element)) {
    element = document.querySelector(element);
  }
  element.addEventListener("click", (e) => {
    if (obj instanceof Object) {
      for (let key in obj) {
        let t = e.target;
        if (obj.hasOwnProperty(key)) {
          while (!t.matches(key)) {
            if (t === element) {
              t = null;
              break;
            }
            t = t.parentNode;
          }
          fn(t, key);
        }
      }
    } else if (typeof obj === "string") {
      let t = e.target;
      try {
        while (!t.matches(obj)) {
          if (t === element) {
            t = null;
            break;
          }
          t = t.parentNode;
        }
        fn(t);
      } catch (err) {}
    }
  });
}

const siteList = document.querySelector(".siteList");
const addList = document.querySelector("#addList");
const addContent = document.querySelector(".addContent");
const reviseContent = document.querySelector(".reviseContent");
let myHashMap = JSON.parse(window.localStorage.getItem("site"));
let close;
let site;
let inIcon;
const hashMap = myHashMap || [
  {
    url: "http://bonsaiden.github.io/JavaScript-Garden/zh/",
    webName: "JavaScript 秘密花园",
    disName: "JS秘密花园",
    backColor: "red",
  },
  {
    url: "https://wangdoc.com/",
    webName: "网道 - 互联网开发文档",
    disName: "网道",
    backColor: "sky",
  },
  {
    url: "https://developer.mozilla.org/zh-CN/docs/Web",
    webName: "MDN",
    disName: "Web开发技术 | MDN",
    backColor: "blue",
  },
  {
    url: "https://juejin.cn/",
    webName: "掘金",
    disName: "掘金",
    backColor: "yellow",
  },
  {
    url: "https://github.com/Gjc452",
    webName: "我的GitHub",
    disName: "GitHub",
    backColor: "violet",
  },
  {
    url: "https://www.yuque.com/xihang-c9xlp/guegsk",
    webName: "我的博客",
    disName: "语雀",
    backColor: "blue",
  },
];

// 渲染网站列表
const render = () => {
  let x = siteList.firstChild;
  while (x) {
    siteList.removeChild(x);
    x = siteList.firstChild;
  }
  let id = 0;
  hashMap.forEach((node, index) => {
    const li = `
      <li class= siteWrap${id} data="${id}">
        <div class="site ${node.backColor}">
          <div class="logo">
            <text x="45" y="45" fill="white" text-anchor="middle" dominant-baseline="middle"
            font-size="20px">
              ${node.disName}
            </text>
            <svg class="icon  inIcon" aria-hidden="true">
              <use xlink:href="#icon-revise"></use>
            </svg>
          </div>
          <div class="close">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
         </div>
         <div class="link">${node.webName}</div>
      </li>
    `;
    const add = document.createElement("template");
    add.innerHTML = li.trim();
    siteList.appendChild(add.content.firstChild);
    let siteWrap = document.querySelector(".siteWrap" + id.toString());
    on("click", siteWrap, ".close", (t) => {
      if (t) {
        hashMap.splice(index, 1);
        render();
      } else if (siteList.firstChild.classList.length === 2) {
      } else {
        window.open(node.url);
      }
    });
    id += 1;
  });
  close = document.querySelectorAll(".close");
  site = document.querySelectorAll(".site");
  inIcon = document.querySelectorAll(".inIcon");
};
render();

// 存储数据
window.onbeforeunload = () => {
  window.localStorage.setItem("site", JSON.stringify(hashMap));
};

// 鼠标右键删除样式
siteList.addEventListener("mousedown", (e) => {
  let t = e.target;
  while (!t.matches("li")) {
    if (t === siteList) {
      t = null;
      break;
    }
    t = t.parentNode;
  }
  if (t) {
    if (e.button === 2) {
      close.forEach((node) => {
        node.classList.add("active");
      });
      site.forEach((node) => {
        node.classList.add("active");
      });
      inIcon.forEach((node) => {
        node.classList.add("active");
      });
      siteList.childNodes.forEach((node) => {
        node.classList.add("deleteWeb");
      });
    }
    siteList.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }
});

// 取消删除样式
on("click", document.body, ".site", (t) => {
  if (!t) {
    close.forEach((node) => {
      node.classList.remove("active");
    });
    site.forEach((node) => {
      node.classList.remove("active");
    });
    inIcon.forEach((node) => {
      node.classList.remove("active");
    });
    siteList.childNodes.forEach((node) => {
      node.classList.remove("deleteWeb");
    });
  }
});

// 显示添加栏
addList.addEventListener("click", () => {
  setTimeout(() => {
    addContent.classList.add("active");
  });
});
siteList.addEventListener("click", (e) => {
  let t = e.target;
  while (!t.matches(".deleteWeb")) {
    if (t === siteList || t.matches(".close")) {
      t = null;
      break;
    }
    t = t.parentNode;
  }
  if (t) {
    setTimeout(() => {
      reviseContent.classList.add("active");
    });
  }
});
// 隐藏添加栏
const closeAddContent = document.querySelectorAll(".closeAddContent");
on("click", document.body, ".addContent", (t) => {
  if (addContent.classList.length === 2) {
    if (!t) {
      addContent.classList.remove("active");
    }
  }
});
on("click", document.body, ".reviseContent", (t) => {
  if (reviseContent.classList.length === 2) {
    if (!t) {
      reviseContent.classList.remove("active");
    }
  }
});
closeAddContent.forEach((node) => {
  node.addEventListener("click", () => {
    reviseContent.classList.remove("active");
    addContent.classList.remove("active");
  });
});

// 添加网站
const addWebUrl = document.querySelector("#addWebUrl");
const addWebName = document.querySelector("#addWebName");
const addDisName = document.querySelector("#addDisName");
const refer = document.querySelector("#addRefer");
const color = document.querySelector(".color");
const colorList = document.querySelector(".colorList");
let webRecord = { url: "", webName: "", disName: "", backColor: "" };
let newUrl;
let newWebName;
let disName;
let newBackColor = "red";
addWebUrl.addEventListener("input", (e) => {
  newUrl = e.target.value;
});
addWebName.addEventListener("input", (e) => {
  newWebName = e.target.value;
});
addDisName.addEventListener("input", (e) => {
  newDisName = e.target.value;
});
on("click", colorList, "li", (t) => {
  let className = t.className;
  color.className = `color ${className}`;
  newBackColor = className;
});
refer.addEventListener("click", () => {
  if (newUrl) {
    webRecord.url = "https://" + newUrl;
    newWebName
      ? (webRecord.webName = newWebName.trim())
      : (webRecord.webName = "");
    newDisName
      ? (webRecord.disName = newDisName.trim())
      : (webRecord.disName = "");
    webRecord.backColor = newBackColor;
    hashMap.push(webRecord);
    render();
    addWebUrl.value = "";
    addWebName.value = "";
    addDisName.value = "";
    color.className = "red";
    webRecord = { url: "", webName: "", disName: "", backColor: "" };
  } else {
    alert("请填写网址");
  }
});
// 修改网站
const nowWebName = document.querySelector("#webName");
const nowDisName = document.querySelector("#disName");
const nowUrl = document.querySelector("#webUrl");
const nowColor = document.querySelector(".nowColor");
const nowColorList = document.querySelector(".nowColorList");
const change = document.querySelector("#change");
let m;
let nowBackColor;
siteList.addEventListener("click", (e) => {
  let t = e.target;
  while (!t.matches("li")) {
    if (t === siteList || t.matches(".close")) {
      t = null;
      break;
    }
    t = t.parentNode;
  }
  if (t) {
    m = t.getAttribute("data");
    nowUrl.value = hashMap[m].url;
    nowDisName.value = hashMap[m].disName;
    nowWebName.value = hashMap[m].webName;
    let className = hashMap[m].backColor;
    nowColor.className = `color ${className}`;
    nowBackColor = className;
  }
});
on("click", nowColorList, "li", (t) => {
  let className = t.className;
  nowColor.className = `color ${className}`;
  nowBackColor = className;
});
change.addEventListener("click", () => {
  hashMap[m].url = nowUrl.value;
  hashMap[m].disName = nowDisName.value;
  hashMap[m].webName = nowWebName.value;
  hashMap[m].backColor = nowBackColor;
  render();
});
