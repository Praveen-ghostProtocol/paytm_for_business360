/* ============================================================
   Paytm Business 360 — Prototype interaction layer
   Shared across all screens. Colours match the design system:
   Primary #00BAF2 · Secondary/Navy #002970 · Tertiary #16A34A
   ============================================================ */
(function () {
  "use strict";

  var C = {
    primary: "#00BAF2",
    navy: "#002970",
    green: "#16A34A",
    surface: "#F7FAFC",
    ink: "#181C1E",
    muted: "#5B6A78"
  };

  /* ---------- Toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.cssText =
        "position:fixed;left:50%;bottom:96px;transform:translateX(-50%) translateY(12px);" +
        "z-index:9999;max-width:82%;padding:11px 18px;border-radius:999px;" +
        "background:" + C.navy + ";color:#fff;font-family:Inter,system-ui,sans-serif;" +
        "font-size:13px;font-weight:600;letter-spacing:.01em;text-align:center;" +
        "box-shadow:0 8px 24px rgba(0,41,112,.28);opacity:0;pointer-events:none;" +
        "transition:opacity .22s ease,transform .22s ease;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () {
      toastEl.style.opacity = "1";
      toastEl.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(-50%) translateY(12px)";
    }, 1900);
  }
  window.protoToast = toast;
  /* Alias the common Stitch toast name if the page never defined one */
  if (typeof window.showToast !== "function") window.showToast = toast;

  /* ---------- Dummy QR code (deterministic SVG) ---------- */
  function qrSvg() {
    var n = 25, cell = 8, pad = 4, size = n * cell + pad * 2;
    var rects = "";
    /* pseudo-random but fixed pattern */
    var seed = 987654321;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 8) & 1; }
    function finder(ox, oy) {
      var s = "";
      for (var y = 0; y < 7; y++) for (var x = 0; x < 7; x++) {
        var on = (x === 0 || x === 6 || y === 0 || y === 6) || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
        if (on) s += "<rect x='" + (pad + (ox + x) * cell) + "' y='" + (pad + (oy + y) * cell) +
          "' width='" + cell + "' height='" + cell + "' fill='" + C.navy + "'/>";
      }
      return s;
    }
    function inFinder(x, y) {
      return (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
    }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (rnd()) rects += "<rect x='" + (pad + x * cell) + "' y='" + (pad + y * cell) +
        "' width='" + cell + "' height='" + cell + "' fill='" + C.navy + "'/>";
    }
    rects += finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7);
    return "<svg viewBox='0 0 " + size + " " + size + "' width='196' height='196' " +
      "xmlns='http://www.w3.org/2000/svg'><rect width='" + size + "' height='" + size +
      "' rx='10' fill='#fff'/>" + rects + "</svg>";
  }

  /* ---------- QR modal ---------- */
  function showQR() {
    if (document.getElementById("proto-qr")) return;
    var ov = document.createElement("div");
    ov.id = "proto-qr";
    ov.style.cssText =
      "position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;" +
      "padding:24px;background:rgba(0,20,45,.55);backdrop-filter:blur(4px);" +
      "font-family:Inter,system-ui,sans-serif;opacity:0;transition:opacity .2s ease;";
    ov.innerHTML =
      "<div style='width:100%;max-width:340px;background:#fff;border-radius:24px;overflow:hidden;" +
      "box-shadow:0 24px 60px rgba(0,41,112,.35);transform:translateY(14px);transition:transform .22s ease'>" +
        "<div style='background:linear-gradient(135deg," + C.navy + "," + C.primary + ");padding:18px 20px;" +
        "display:flex;align-items:center;justify-content:space-between'>" +
          "<div style='color:#fff'>" +
            "<div style='font-size:11px;font-weight:700;letter-spacing:.08em;opacity:.85;text-transform:uppercase'>Scan &amp; Pay</div>" +
            "<div style='font-size:16px;font-weight:800;margin-top:2px'>Sharma General Store</div>" +
          "</div>" +
          "<button id='proto-qr-x' aria-label='Close' style='width:36px;height:36px;border:none;border-radius:999px;" +
          "background:rgba(255,255,255,.18);color:#fff;font-size:20px;cursor:pointer;line-height:1'>&times;</button>" +
        "</div>" +
        "<div style='padding:22px 20px 8px;text-align:center'>" +
          "<div style='display:inline-block;padding:12px;border-radius:16px;border:1px solid #E2E9EF;box-shadow:0 6px 18px rgba(0,41,112,.08)'>" +
            qrSvg() +
          "</div>" +
          "<div style='margin-top:14px;font-size:13px;color:" + C.muted + "'>UPI ID</div>" +
          "<div style='font-size:15px;font-weight:700;color:" + C.ink + "'>sharmastore@paytm</div>" +
          "<div style='display:flex;align-items:center;justify-content:center;gap:6px;margin:14px 0 4px;color:" + C.green + ";font-size:12px;font-weight:700'>" +
            "<span>●</span> Accepting payments</div>" +
        "</div>" +
        "<div style='padding:8px 20px 22px'>" +
          "<button id='proto-qr-done' style='width:100%;height:46px;border:none;border-radius:12px;background:" + C.primary + ";" +
          "color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(0,186,242,.35)'>Done</button>" +
        "</div>" +
      "</div>";
    document.body.appendChild(ov);
    requestAnimationFrame(function () {
      ov.style.opacity = "1";
      ov.firstChild.style.transform = "translateY(0)";
    });
    function close() { ov.style.opacity = "0"; setTimeout(function () { ov.remove(); }, 200); }
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    ov.querySelector("#proto-qr-x").addEventListener("click", close);
    ov.querySelector("#proto-qr-done").addEventListener("click", close);
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });
  }
  window.showQR = showQR;

  /* ---------- Wire everything once the DOM is ready ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    /* 1. QR / Collect triggers */
    document.querySelectorAll('[data-path="collect"]').forEach(function (el) {
      el.removeAttribute("href");
      el.style.cursor = "pointer";
      el.dataset.proto = "1";
      el.addEventListener("click", function (e) { e.preventDefault(); showQR(); });
    });
    /* any button/link that is really a QR action */
    document.querySelectorAll("button, a").forEach(function (el) {
      if (el.dataset.proto) return;
      var icon = el.querySelector(".material-symbols-outlined");
      var iconTxt = icon ? icon.textContent.trim() : "";
      var txt = (el.textContent || "").toLowerCase();
      if (iconTxt.indexOf("qr_code") === 0 || /\bqr\b|show qr|scan/.test(txt)) {
        el.dataset.proto = "1";
        el.style.cursor = "pointer";
        el.addEventListener("click", function (e) { e.preventDefault(); showQR(); });
      }
    });

    /* 2. Balance eye toggle (Home) */
    var eyeBtn = document.getElementById("toggleBalanceBtn");
    var balance = document.getElementById("balanceDisplay");
    var eye = document.getElementById("eyeIcon");
    if (eyeBtn && balance) {
      eyeBtn.dataset.proto = "1";
      var realBal = balance.textContent, hidden = false;
      eyeBtn.addEventListener("click", function () {
        hidden = !hidden;
        balance.textContent = hidden ? "₹ • • • • •" : realBal;
        if (eye) eye.textContent = hidden ? "visibility_off" : "visibility";
      });
    }

    /* 3. Catch-all: no dead buttons. Any button without its own action
          gives a friendly prototype confirmation instead of doing nothing. */
    document.querySelectorAll("button").forEach(function (btn) {
      if (btn.dataset.proto) return;
      if (btn.getAttribute("onclick")) return;          /* already has a handler */
      if (btn.closest("a[href]")) return;               /* it's inside a real link */
      if (btn.id === "pay-button") return;              /* wired to navigate */
      btn.dataset.proto = "1";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", function () {
        var label = btn.getAttribute("aria-label");
        if (!label) {
          /* read text without the material-symbol icon ligatures */
          var clone = btn.cloneNode(true);
          clone.querySelectorAll(".material-symbols-outlined, svg").forEach(function (n) { n.remove(); });
          label = (clone.textContent || "").trim().replace(/\s+/g, " ");
        }
        if (!label) label = "Action";
        if (label.length > 34) label = label.slice(0, 34) + "…";
        toast(label + " — prototype");
      });
    });
  });
})();
