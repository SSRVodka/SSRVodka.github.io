var percentFlag = false; // 节流阀
function talkScroll() {
  let a = document.documentElement.scrollTop || window.pageYOffset; // 卷去高度
  const waterfallResult = a % document.documentElement.clientHeight; // 卷去一个视口
  result <= 99 || (result = 99);

  if (
    !percentFlag &&
    waterfallResult + 100 >= document.documentElement.clientHeight &&
    document.querySelector("#waterfall")
  ) {
    // console.info(waterfallResult, document.documentElement.clientHeight);
    setTimeout(() => {
      waterfall("#waterfall");
    }, 500);
  } else {
    setTimeout(() => {
      document.querySelector("#waterfall") && waterfall("#waterfall");
    }, 500);
  }

  const r = window.scrollY + document.documentElement.clientHeight;

  let p = document.getElementById("post-comment") || document.getElementById("footer");

  (p.offsetTop + p.offsetHeight / 2 < r || 90 < result) && (percentFlag = true);
}
function replaceAll(e, n, t) {
  return e.split(n).join(t);
}

let talk_backend_url = "";
let talk_emoji_cache = [
  {key: '-1', data: [{ emoji: "🤔", cnt: 1 }]}  // test for -1
];

var btf_talk = {
  diffDate: function (d, more = false) {
    const dateNow = new Date();
    const datePost = new Date(d);
    const dateDiff = dateNow.getTime() - datePost.getTime();
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    let result;
    if (more) {
      const monthCount = dateDiff / month;
      const dayCount = dateDiff / day;
      const hourCount = dateDiff / hour;
      const minuteCount = dateDiff / minute;

      if (monthCount >= 1) {
        result = datePost.toLocaleDateString().replace(/\//g, "-");
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + " " + GLOBAL_CONFIG.dateSuffix.day;
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + " " + GLOBAL_CONFIG.dateSuffix.hour;
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.dateSuffix.min;
      } else {
        result = GLOBAL_CONFIG.dateSuffix.just;
      }
    } else {
      result = parseInt(dateDiff / day);
    }
    return result;
  },
  updateTimeInMoment: function () {
    document.querySelector("#bber") &&
      document.querySelectorAll("#bber time").forEach(function (e) {
        var t = e,
          datetime = t.getAttribute("datetime");
        (t.innerText = btf_talk.diffDate(datetime, true)), (t.style.display = "inline");
      });
  },
  refreshWaterFall: function () {
    document.querySelector("#waterfall") &&
      setTimeout(function () {
        waterfall("#waterfall");
        document.getElementById("waterfall").classList.add("show");
      }, 500);
  },
  commentText: function (e) {
    if (e == "undefined" || e == "null") e = "好棒！";
    var n = document.getElementsByClassName("el-textarea__inner")[0],
      t = document.createEvent("HTMLEvents");
    if (!n) return;
    t.initEvent("input", !0, !0);
    var o = replaceAll(e, "\n", "\n> ");
    (n.value = "> " + o + "\n\n"), n.dispatchEvent(t);
    var i = document.querySelector("#post-comment").offsetTop;
    window.scrollTo(0, i - 80),
      n.focus(),
      n.setSelectionRange(-1, -1),
      document.getElementById("comment-tips") && document.getElementById("comment-tips").classList.add("show");
  },
  pickFor: function (index) {
    const selected_item = `item-picker-container-${index}`;
    const container = document.getElementById(selected_item);
    if (container.classList.contains("selecting")) {
      btf_talk.hidePicker(container);
    } else {
      // clear container first
      for (const child of container.children) {
        container.removeChild(child);
      }
      const pickerOptions = { onEmojiSelect: console.log };
      const picker = new EmojiMart.Picker(pickerOptions);
      picker.style.position = 'absolute';
      picker.style.transition = 'all 0.2s';
      picker.style.scale = '0';
      container.style.zIndex = '1000';
      container.appendChild(picker);
      // sleep 1s to avoid immediate close by handler
      setTimeout(() => {
        container.classList.add("selecting");
        // appear use animation
        picker.style.scale = '1';
      }, 300);
    }
  },
  hidePicker: function(container) {
    for (const child of container.children) {
      child.style.scale = '0';
    }
    setTimeout(() => {
      container.style.zIndex = '';
    }, 300);
  },
  handlePickerClose: function (event) {
    const containers = document.querySelectorAll(".bber-emoji-picker-container");
    for (const container of containers) {
      if (container.classList.contains("selecting")) {
        if (!container.contains(event.target)) {
          btf_talk.hidePicker(container);
          container.classList.remove("selecting");
        }
      }
    }
  },
  loadTarget: function (data_idx) {
    if (!talk_backend_url || talk_backend_url.length === 0) return;
    // find from cache
    const cache_idx = talk_emoji_cache.findIndex((val)=>val.key===data_idx);
    if (cache_idx === -1) {
      // no emoji here: do nothing
      return;
    }
  },
  onLoad: function (url) {
    if (!url) return;
    talk_backend_url = url;
    // setup cache

  }
};

btf_talk.updateTimeInMoment();
btf_talk.refreshWaterFall();
btf_talk.fetchAllEmoji();
document.addEventListener('click', btf_talk.handlePickerClose);
