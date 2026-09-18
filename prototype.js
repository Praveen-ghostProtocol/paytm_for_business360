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

  /* Relative links between the sibling screen folders */
  var REL = {
    home:     "../home_paytm_business_360/code.html",
    pay:      "../pay_hub_supplier_payments/code.html",
    security: "../security_check_high_value_payment/code.html",
    success:  "../payment_success_digital_receipt/code.html",
    records:  "../business_records_reconciliation/code.html"
  };

  /* Neutralise in-page handlers that depend on modals / back-ends we don't
     ship, so their buttons give clean prototype feedback instead of failing. */
  window.triggerPay      = function (name, amount) { openPaySheet(name, amount); };
  window.viewDetails     = function (n) { toast((n ? n + " " : "") + "bill copy — prototype"); };
  window.saveSupplier    = function () { toast("Supplier saved — prototype"); };
  window.simulateGstLookup = function () { toast("Verifying GSTIN — prototype"); };

  /* Clean visible label for an element (drops icon ligatures / svg) */
  function labelText(el) {
    var a = el.getAttribute("aria-label");
    if (a) return a;
    var c = el.cloneNode(true);
    c.querySelectorAll(".material-symbols-outlined, svg").forEach(function (n) { n.remove(); });
    return (c.textContent || "").trim().replace(/\s+/g, " ");
  }

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

  /* ---------- Bottom sheet primitive ---------- */
  function openSheet(innerHtml, maxH) {
    var ov = document.createElement("div");
    ov.style.cssText =
      "position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-end;justify-content:center;" +
      "background:rgba(0,20,45,.5);backdrop-filter:blur(3px);opacity:0;transition:opacity .2s ease;" +
      "font-family:Inter,system-ui,sans-serif;";
    var card = document.createElement("div");
    card.style.cssText =
      "width:100%;max-width:420px;max-height:" + (maxH || "86vh") + ";overflow-y:auto;background:#fff;" +
      "border-radius:24px 24px 0 0;box-shadow:0 -12px 40px rgba(0,41,112,.28);" +
      "transform:translateY(24px);transition:transform .24s ease;" +
      "padding:10px 18px calc(22px + env(safe-area-inset-bottom));";
    card.innerHTML =
      "<div style='width:40px;height:4px;border-radius:99px;background:#d7dee5;margin:2px auto 14px'></div>" + innerHtml;
    ov.appendChild(card);
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.style.opacity = "1"; card.style.transform = "translateY(0)"; });
    function close() {
      ov.style.opacity = "0"; card.style.transform = "translateY(24px)";
      setTimeout(function () { ov.remove(); }, 220);
    }
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    card.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", close); });
    card.querySelectorAll("[data-toast]").forEach(function (el) {
      el.addEventListener("click", function () { close(); setTimeout(function () { toast(el.getAttribute("data-toast")); }, 180); });
    });
    card.querySelectorAll("[data-loan]").forEach(function (el) {
      el.addEventListener("click", function () { close(); setTimeout(openLoan, 200); });
    });
    card.querySelectorAll("[data-profile]").forEach(function (el) {
      el.addEventListener("click", function () { close(); setTimeout(openProfile, 200); });
    });
    card.querySelectorAll("[data-open]").forEach(function (el) {
      el.addEventListener("click", function () {
        var fn = window[el.getAttribute("data-open")];
        var arg = el.getAttribute("data-arg") || undefined;
        close();
        if (typeof fn === "function") setTimeout(function () { fn(arg); }, 180);
      });
    });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });
  }

  function row(icon, label, attr, color) {
    color = color || C.ink;
    return "<button " + attr + " style='width:100%;background:none;border:none;border-bottom:1px solid #eef1f3;" +
      "padding:13px 4px;display:flex;align-items:center;gap:13px;cursor:pointer'>" +
      "<span class='material-symbols-outlined' style='font-size:22px;color:" + color + "'>" + icon + "</span>" +
      "<span style='flex:1;text-align:left;font-size:14px;font-weight:600;color:" + color + "'>" + label + "</span>" +
      "<span class='material-symbols-outlined' style='font-size:20px;color:#b7c2cc'>chevron_right</span></button>";
  }
  function tile(icon, label, attr) {
    return "<button " + attr + " style='background:#f1f4f6;border:none;border-radius:14px;padding:13px 6px;" +
      "display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer'>" +
      "<span class='material-symbols-outlined' style='font-size:23px;color:" + C.navy + "'>" + icon + "</span>" +
      "<span style='font-size:11px;font-weight:600;color:" + C.ink + ";text-align:center;line-height:1.15'>" + label + "</span></button>";
  }
  function stat(k, v, last) {
    return "<div style='display:flex;justify-content:space-between;padding:8px 0;" +
      (last ? "" : "border-bottom:1px solid #e3e8ec") + "'>" +
      "<span style='font-size:13px;color:" + C.muted + "'>" + k + "</span>" +
      "<span style='font-size:14px;font-weight:700;color:" + C.ink + "'>" + v + "</span></div>";
  }
  function badge(k, v, ok) {
    return "<div style='flex:1;background:#f1f4f6;border-radius:12px;padding:10px 12px'>" +
      "<div style='font-size:10px;font-weight:700;letter-spacing:.06em;color:" + C.muted + "'>" + k + "</div>" +
      "<div style='font-size:13px;font-weight:700;margin-top:2px;color:" + (ok ? C.green : C.ink) + "'>" + v + "</div></div>";
  }

  /* ---------- More menu ---------- */
  function openMore() {
    var loanCard =
      "<div style='background:linear-gradient(135deg," + C.navy + "," + C.primary + ");border-radius:18px;padding:16px;color:#fff;margin-bottom:16px'>" +
        "<div style='display:flex;justify-content:space-between;align-items:center'>" +
          "<span style='font-size:11px;font-weight:700;letter-spacing:.07em;opacity:.9'>PRE-APPROVED BUSINESS LOAN</span>" +
          "<span class='material-symbols-outlined' style='font-size:20px'>verified</span></div>" +
        "<div style='font-size:28px;font-weight:800;margin-top:6px'>&#8377;5,00,000</div>" +
        "<div style='font-size:12px;opacity:.92;margin-top:2px'>Instant disbursal &middot; 14% p.a. &middot; No collateral</div>" +
        "<button data-loan style='margin-top:13px;width:100%;height:42px;border:none;border-radius:11px;background:#fff;color:" + C.navy + ";font-size:14px;font-weight:700;cursor:pointer'>View Offer</button></div>";
    var grid =
      "<div style='display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px'>" +
        tile("account_balance", "Loans", "data-loan") +
        tile("shield", "Insurance", "data-toast='Business Insurance — prototype'") +
        tile("savings", "Settle", "data-toast='Settlements — prototype'") +
        tile("receipt_long", "Reports", "data-toast='GST and Tax Reports — prototype'") +
        tile("redeem", "Rewards", "data-toast='Rewards and Cashback — prototype'") +
        tile("speaker", "Devices", "data-open='openDevices'") +
        tile("groups", "Staff", "data-toast='Staff and Roles — prototype'") +
        tile("support_agent", "Help", "data-open='openSupport'") +
        tile("menu_book", "Khata", "data-open='openKhata'") +
        tile("trending_up", "Cash-flow", "data-open='openForecast'") +
      "</div>";
    var rows =
      row("person", "My Profile", "data-profile") +
      row("settings", "Business Settings", "data-toast='Settings — prototype'") +
      row("logout", "Log Out", "data-toast='Logged out — prototype'", "#ba1a1a");
    openSheet("<div style='font-size:18px;font-weight:800;margin:0 2px 14px'>More</div>" + loanCard + grid + rows);
  }
  window.openMore = openMore;

  /* ---------- Loan detail ---------- */
  function openLoan() {
    var html =
      "<div style='font-size:18px;font-weight:800;margin:0 2px 2px'>Pre-approved Business Loan</div>" +
      "<div style='font-size:12px;color:" + C.muted + ";margin:0 2px 16px'>Based on 18 months of your Paytm settlements</div>" +
      "<div style='background:#f1f4f6;border-radius:16px;padding:6px 16px;margin-bottom:14px'>" +
        stat("Eligible amount", "&#8377;5,00,000") +
        stat("Interest rate", "14% p.a. reducing") +
        stat("Tenure", "up to 24 months") +
        stat("EMI (12 months)", "&#8377;44,900 / mo") +
        stat("Processing fee", "&#8377;0 · Limited offer", true) +
      "</div>" +
      "<div style='display:flex;align-items:center;gap:8px;background:rgba(22,163,74,.10);border-radius:12px;padding:11px 13px;margin-bottom:16px'>" +
        "<span class='material-symbols-outlined' style='color:" + C.green + ";font-size:20px'>bolt</span>" +
        "<span style='font-size:12px;color:#0f5132;font-weight:600'>Funds reach your settlement account within 2 minutes of approval</span></div>" +
      "<button data-toast='Loan application submitted, our team will call you shortly' style='width:100%;height:48px;border:none;border-radius:13px;background:" + C.navy + ";color:#fff;font-size:15px;font-weight:700;cursor:pointer'>Accept &amp; Apply</button>" +
      "<button data-close style='width:100%;height:42px;border:none;background:none;color:" + C.muted + ";font-size:14px;font-weight:600;cursor:pointer;margin-top:4px'>Maybe later</button>";
    openSheet(html);
  }
  window.openLoan = openLoan;

  /* ---------- Profile ---------- */
  function openProfile() {
    var head =
      "<div style='display:flex;align-items:center;gap:14px;padding:2px 2px 16px'>" +
        "<div style='width:56px;height:56px;border-radius:16px;flex-shrink:0;background:linear-gradient(135deg," + C.navy + "," + C.primary + ");display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:800'>S</div>" +
        "<div style='min-width:0'><div style='display:flex;align-items:center;gap:5px'>" +
          "<span style='font-size:17px;font-weight:800'>Sharma General Store</span>" +
          "<span class='material-symbols-outlined' style='font-size:16px;color:" + C.primary + "'>verified</span></div>" +
          "<div style='font-size:12px;color:" + C.muted + "'>+91 98&bull;&bull;&bull; &bull;&bull;210 &middot; Merchant since 2019</div></div></div>";
    var kyc =
      "<div style='display:flex;gap:10px;margin-bottom:16px'>" +
        badge("GSTIN", "07AAA&bull;&bull;1Z5") + badge("KYC STATUS", "Verified", true) + "</div>";
    var rows =
      row("account_circle", "My Profile", "data-toast='My Profile — prototype'") +
      row("store", "Business Details", "data-toast='Business Details — prototype'") +
      row("account_balance", "Bank &amp; Settlement", "data-toast='Bank and Settlement — prototype'") +
      row("account_balance_wallet", "Pre-approved Loans", "data-loan") +
      row("language", "Language", "data-toast='Language — prototype'") +
      row("support_agent", "Help &amp; Support", "data-open='openSupport'") +
      row("logout", "Log Out", "data-toast='Logged out — prototype'", "#ba1a1a");
    openSheet(head + kyc + rows);
  }
  window.openProfile = openProfile;

  /* ---------- Payment options (shown before the review screen) ---------- */
  function fmtAmt(n) {
    n = String(n).replace(/[^\d]/g, "");
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function money(n) {
    var p = (Math.round(n * 100) / 100).toFixed(2).split(".");
    return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + p[1];
  }
  function openPaySheet(recipient, amount) {
    if (document.getElementById("proto-pay")) return;
    recipient = recipient || "Verified recipient";
    var initial = amount ? String(amount).replace(/[^\d]/g, "") : "75000";

    var ov = document.createElement("div");
    ov.id = "proto-pay";
    ov.style.cssText =
      "position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-end;justify-content:center;" +
      "background:rgba(0,20,45,.5);backdrop-filter:blur(3px);opacity:0;transition:opacity .2s ease;font-family:Inter,system-ui,sans-serif;";
    var card = document.createElement("div");
    card.style.cssText =
      "width:100%;max-width:420px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:24px 24px 0 0;" +
      "box-shadow:0 -12px 40px rgba(0,41,112,.28);transform:translateY(24px);transition:transform .24s ease;" +
      "padding:10px 18px calc(22px + env(safe-area-inset-bottom));";

    var chips = [10000, 25000, 50000, 75000].map(function (v) {
      return "<button class='ps-chip' data-amt='" + v + "' style='flex:1;padding:9px 0;border:1px solid #e2e9ef;" +
        "border-radius:11px;background:#fff;color:" + C.ink + ";font-size:13px;font-weight:700;cursor:pointer'>₹" + fmtAmt(v) + "</button>";
    }).join("");

    function speed(id, ic, name, desc, def) {
      return "<button class='ps-speed' data-def='" + (def ? 1 : 0) + "' style='width:100%;display:flex;align-items:center;gap:12px;" +
        "padding:12px 13px;border:1.5px solid #e2e9ef;border-radius:14px;background:#fff;cursor:pointer;margin-bottom:9px'>" +
        "<span class='material-symbols-outlined' style='font-size:22px;color:" + C.navy + "'>" + ic + "</span>" +
        "<span style='flex:1;text-align:left'><span style='display:block;font-size:14px;font-weight:700;color:" + C.ink + "'>" + name + "</span>" +
        "<span style='display:block;font-size:12px;color:" + C.muted + "'>" + desc + "</span></span>" +
        "<span class='ps-radio' style='width:20px;height:20px;border-radius:99px;border:2px solid #cdd6de;flex-shrink:0'></span></button>";
    }

    card.innerHTML =
      "<div style='width:40px;height:4px;border-radius:99px;background:#d7dee5;margin:2px auto 14px'></div>" +
      "<div style='font-size:18px;font-weight:800;margin:0 2px 3px'>Payment details</div>" +
      "<div style='font-size:12px;color:" + C.muted + ";margin:0 2px 14px'>Pay to <b style='color:" + C.ink + "'>" + recipient + "</b></div>" +
      "<div style='background:#f1f4f6;border-radius:16px;padding:14px 16px;margin-bottom:14px'>" +
        "<div style='font-size:11px;font-weight:700;letter-spacing:.06em;color:" + C.muted + "'>AMOUNT</div>" +
        "<div style='display:flex;align-items:center;gap:6px;margin-top:4px'>" +
          "<span style='font-size:28px;font-weight:800;color:" + C.ink + "'>₹</span>" +
          "<input id='ps-amt' inputmode='numeric' value='" + fmtAmt(initial) + "' style='flex:1;border:none;background:none;outline:none;font-size:28px;font-weight:800;color:" + C.ink + ";width:100%;font-family:inherit'/>" +
        "</div>" +
        "<div style='display:flex;gap:8px;margin-top:12px'>" + chips + "</div>" +
      "</div>" +
      "<div style='font-size:11px;font-weight:700;letter-spacing:.06em;color:" + C.muted + ";margin:6px 2px 9px'>PAYMENT SPEED</div>" +
      speed("upi", "bolt", "Instant · UPI", "Free · settles in seconds", false) +
      speed("imps", "account_balance", "Instant · IMPS", "₹5 fee · settles in seconds", true) +
      speed("neft", "schedule", "Same-day · NEFT", "Free · settles by 6 PM", false) +
      "<button id='ps-continue' style='width:100%;height:50px;border:none;border-radius:14px;background:" + C.navy + ";color:#fff;font-size:15px;font-weight:700;cursor:pointer;margin-top:8px;box-shadow:0 8px 20px rgba(0,41,112,.25)'>Continue to review</button>" +
      "<button id='ps-cancel' style='width:100%;height:44px;border:none;background:none;color:" + C.muted + ";font-size:14px;font-weight:600;cursor:pointer;margin-top:2px'>Cancel</button>";

    ov.appendChild(card);
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.style.opacity = "1"; card.style.transform = "translateY(0)"; });
    function close() { ov.style.opacity = "0"; card.style.transform = "translateY(24px)"; setTimeout(function () { ov.remove(); }, 220); }

    var amt = card.querySelector("#ps-amt");
    function setChip(active) {
      card.querySelectorAll(".ps-chip").forEach(function (c) {
        var on = c === active;
        c.style.background = on ? C.primary : "#fff";
        c.style.color = on ? "#fff" : C.ink;
        c.style.borderColor = on ? C.primary : "#e2e9ef";
      });
    }
    card.querySelectorAll(".ps-chip").forEach(function (c) {
      c.addEventListener("click", function () { amt.value = fmtAmt(c.getAttribute("data-amt")); setChip(c); });
    });
    amt.addEventListener("input", function () { amt.value = fmtAmt(amt.value); setChip(null); });
    var pre = Array.prototype.filter.call(card.querySelectorAll(".ps-chip"), function (c) {
      return c.getAttribute("data-amt") === String(parseInt(initial, 10));
    })[0];
    if (pre) setChip(pre);

    function setSpeed(active) {
      card.querySelectorAll(".ps-speed").forEach(function (s) {
        var on = s === active, r = s.querySelector(".ps-radio");
        s.style.borderColor = on ? C.primary : "#e2e9ef";
        s.style.background = on ? "rgba(0,186,242,.07)" : "#fff";
        r.style.borderColor = on ? C.primary : "#cdd6de";
        r.style.background = on ? C.primary : "transparent";
        r.style.boxShadow = on ? "inset 0 0 0 3px #fff" : "none";
      });
    }
    card.querySelectorAll(".ps-speed").forEach(function (s) {
      s.addEventListener("click", function () { setSpeed(s); });
      if (s.getAttribute("data-def") === "1") setSpeed(s);
    });

    card.querySelector("#ps-continue").addEventListener("click", function () {
      close(); setTimeout(function () { location.href = REL.security; }, 160);
    });
    card.querySelector("#ps-cancel").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });
  }
  window.openPaySheet = openPaySheet;

  /* ---------- Itemised fee / settlement breakdown ---------- */
  function openTxnSheet(name, amtText, isCredit) {
    name = name || "Transaction";
    var num = parseInt(String(amtText).replace(/[^\d]/g, ""), 10) || 0;
    var lines, totalK, totalV, note;
    if (isCredit) {
      lines = [["Gross amount received", "₹" + money(num)],
               ["Platform / MDR fee (UPI)", "₹0.00"],
               ["GST on fee", "₹0.00"]];
      totalK = "Net settled to bank"; totalV = "₹" + money(num);
      note = "Zero MDR on UPI collections — credited in full";
    } else {
      lines = [["Transfer amount", "₹" + money(num)],
               ["Instant IMPS charge", "₹5.00"],
               ["GST on charge (18%)", "₹0.90"]];
      totalK = "Total debited"; totalV = "₹" + money(num + 5.90);
      note = "Itemised fees on every transaction — no hidden charges";
    }
    var rowsHtml = lines.map(function (l) {
      return "<div style='display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e3e8ec'>" +
        "<span style='font-size:13px;color:" + C.muted + "'>" + l[0] + "</span>" +
        "<span style='font-size:14px;font-weight:600;color:" + C.ink + "'>" + l[1] + "</span></div>";
    }).join("");
    var html =
      "<div style='display:flex;justify-content:space-between;align-items:start;margin:0 2px 2px'>" +
        "<div style='font-size:18px;font-weight:800'>" + (isCredit ? "Settlement breakdown" : "Payment breakdown") + "</div>" +
        "<span style='font-size:10px;font-weight:700;letter-spacing:.05em;color:" + C.green + ";background:rgba(22,163,74,.12);padding:5px 9px;border-radius:99px'>100% TRANSPARENT</span></div>" +
      "<div style='font-size:12px;color:" + C.muted + ";margin:0 2px 14px'>" + name + "</div>" +
      "<div style='background:#f1f4f6;border-radius:16px;padding:6px 16px;margin-bottom:12px'>" + rowsHtml +
        "<div style='display:flex;justify-content:space-between;padding:11px 0 8px'>" +
          "<span style='font-size:14px;font-weight:800;color:" + C.ink + "'>" + totalK + "</span>" +
          "<span style='font-size:16px;font-weight:800;color:" + C.ink + "'>" + totalV + "</span></div></div>" +
      "<div style='display:flex;align-items:center;gap:8px;background:rgba(22,163,74,.10);border-radius:12px;padding:11px 13px;margin-bottom:14px'>" +
        "<span class='material-symbols-outlined' style='color:" + C.green + ";font-size:20px'>verified</span>" +
        "<span style='font-size:12px;color:#0f5132;font-weight:600'>" + note + "</span></div>" +
      "<button data-open='openSupport' style='width:100%;height:46px;border:1.5px solid #e2e9ef;border-radius:12px;background:#fff;color:" + C.navy + ";font-size:14px;font-weight:700;cursor:pointer'>Report an issue with this payment</button>" +
      "<button data-close style='width:100%;height:42px;border:none;background:none;color:" + C.muted + ";font-size:14px;font-weight:600;cursor:pointer;margin-top:2px'>Close</button>";
    openSheet(html);
  }
  window.openTxnSheet = openTxnSheet;

  /* ---------- Support hub + human dispute / hold flow ---------- */
  function openSupport() {
    var priority =
      "<div style='background:linear-gradient(135deg," + C.navy + "," + C.primary + ");border-radius:18px;padding:16px;color:#fff;margin-bottom:16px'>" +
        "<div style='font-size:11px;font-weight:700;letter-spacing:.07em;opacity:.9'>MONEY STUCK OR ON HOLD?</div>" +
        "<div style='font-size:17px;font-weight:800;margin-top:4px'>Talk to a human in under 30 min</div>" +
        "<div style='font-size:12px;opacity:.92;margin-top:2px'>Priority queue · no chatbots · avg callback 12 min</div>" +
        "<button data-open='openDisputeCase' data-arg=\"Funds on hold / settlement delayed\" style='margin-top:13px;width:100%;height:44px;border:none;border-radius:11px;background:#fff;color:" + C.navy + ";font-size:14px;font-weight:700;cursor:pointer'>Raise a priority dispute</button></div>";
    var reasons = [
      ["schedule", "Settlement delayed / not received"],
      ["report", "Unexpected or surprise charge"],
      ["error", "Failed or stuck payment"],
      ["currency_rupee", "Refund not received"],
      ["speaker", "Soundbox / device issue"]
    ].map(function (r) {
      return row(r[0], r[1], "data-open='openDisputeCase' data-arg=\"" + r[1] + "\"");
    }).join("");
    var chat = row("support_agent", "Chat with support (EN / हिंदी / +8 languages)",
      "data-toast='Connecting you to a support agent — prototype'");
    openSheet("<div style='font-size:18px;font-weight:800;margin:0 2px 14px'>Help &amp; Support</div>" + priority + reasons + chat);
  }
  window.openSupport = openSupport;

  function openDisputeCase(reason) {
    reason = reason || "General issue";
    var caseId = "PTMD-58" + (2000 + Math.floor(Math.random() * 800));
    function step(title, sub, state) {
      var col = state === "done" ? C.green : (state === "active" ? C.primary : "#c3ccd4");
      var ic = state === "done" ? "check_circle" : (state === "active" ? "radio_button_checked" : "radio_button_unchecked");
      return "<div style='display:flex;gap:11px;padding:9px 0'>" +
        "<span class='material-symbols-outlined' style='font-size:22px;color:" + col + "'>" + ic + "</span>" +
        "<div><div style='font-size:14px;font-weight:700;color:" + (state === "pending" ? C.muted : C.ink) + "'>" + title + "</div>" +
        "<div style='font-size:12px;color:" + C.muted + "'>" + sub + "</div></div></div>";
    }
    var html =
      "<div style='text-align:center;padding:6px 0 2px'>" +
        "<span class='material-symbols-outlined' style='font-size:46px;color:" + C.green + "'>verified_user</span>" +
        "<div style='font-size:19px;font-weight:800;margin-top:4px'>Dispute raised</div>" +
        "<div style='font-size:13px;color:" + C.muted + "'>Case #" + caseId + " · Priority · Human-assisted</div></div>" +
      "<div style='background:#f1f4f6;border-radius:14px;padding:12px 14px;margin:14px 0'>" +
        "<div style='font-size:11px;font-weight:700;letter-spacing:.05em;color:" + C.muted + "'>ISSUE</div>" +
        "<div style='font-size:14px;font-weight:700;color:" + C.ink + ";margin-top:2px'>" + reason + "</div></div>" +
      "<div style='display:flex;align-items:center;gap:9px;background:rgba(22,163,74,.10);border-radius:12px;padding:12px 13px;margin-bottom:8px'>" +
        "<span class='material-symbols-outlined' style='color:" + C.green + ";font-size:22px'>bolt</span>" +
        "<span style='font-size:12.5px;color:#0f5132;font-weight:600'>A settlement specialist will call you within 30 minutes — a real human, not a bot</span></div>" +
      "<div style='padding:2px 4px 6px'>" +
        step("Dispute raised", "Just now", "done") +
        step("Assigned to a specialist", "Priority queue · avg 12 min", "active") +
        step("Resolution & callback", "Within 30 minutes", "pending") + "</div>" +
      "<button data-toast='A specialist will call you shortly — prototype' style='width:100%;height:48px;border:none;border-radius:13px;background:" + C.navy + ";color:#fff;font-size:15px;font-weight:700;cursor:pointer;margin-top:6px'>Call me now</button>" +
      "<button data-close style='width:100%;height:42px;border:none;background:none;color:" + C.muted + ";font-size:14px;font-weight:600;cursor:pointer'>Track in Support</button>";
    openSheet(html);
  }
  window.openDisputeCase = openDisputeCase;

  /* ---------- Soundbox / device rental ledger + one-tap cancel ---------- */
  function openDevices() {
    var device =
      "<div style='background:linear-gradient(135deg," + C.navy + "," + C.primary + ");border-radius:18px;padding:16px;color:#fff;margin-bottom:14px'>" +
        "<div style='display:flex;justify-content:space-between;align-items:center'>" +
          "<div><div style='font-size:11px;font-weight:700;letter-spacing:.07em;opacity:.9'>PAYTM SOUNDBOX 4.0</div>" +
          "<div style='font-size:15px;font-weight:800;margin-top:2px'>SN · PTMSB-4471</div></div>" +
          "<span style='font-size:11px;font-weight:700;background:rgba(255,255,255,.2);padding:5px 10px;border-radius:99px'>ACTIVE</span></div>" +
        "<div style='font-size:12px;opacity:.9;margin-top:8px'>4G SIM connected · 88% battery</div></div>";
    var nextCharge =
      "<div style='display:flex;align-items:center;gap:10px;border:1.5px solid " + C.primary + ";background:rgba(0,186,242,.06);border-radius:14px;padding:12px 14px;margin-bottom:14px'>" +
        "<span class='material-symbols-outlined' style='color:" + C.primary + ";font-size:22px'>event_upcoming</span>" +
        "<div><div style='font-size:13px;font-weight:700;color:" + C.ink + "'>Next charge · 1 Oct 2026 · ₹125</div>" +
        "<div style='font-size:11.5px;color:" + C.muted + "'>Rental ₹125/mo incl. GST · WhatsApp + SMS alert 3 days before</div></div></div>";
    var ledgerRows = [["Sep 2026", "Paid"], ["Aug 2026", "Paid"], ["Jul 2026", "Paid"], ["Jun 2026", "Paid · setup"]].map(function (m) {
      return "<div style='display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #eef1f3'>" +
        "<span style='font-size:13px;color:" + C.ink + ";font-weight:600'>" + m[0] + "</span>" +
        "<span style='display:flex;align-items:center;gap:8px'><span style='font-size:13px;font-weight:700;color:" + C.ink + "'>₹125.00</span>" +
        "<span style='font-size:11px;font-weight:700;color:" + C.green + ";background:rgba(22,163,74,.12);padding:3px 8px;border-radius:99px'>" + m[1] + "</span></span></div>";
    }).join("");
    var html =
      "<div style='font-size:18px;font-weight:800;margin:0 2px 14px'>My Devices</div>" + device + nextCharge +
      "<div style='font-size:11px;font-weight:700;letter-spacing:.06em;color:" + C.muted + ";margin:2px 2px 4px'>RENTAL LEDGER</div>" +
      "<div style='margin-bottom:14px'>" + ledgerRows + "</div>" +
      "<button data-open='openCancelDevice' style='width:100%;height:48px;border:1.5px solid #ba1a1a;border-radius:13px;background:#fff;color:#ba1a1a;font-size:15px;font-weight:700;cursor:pointer'>Cancel rental · one tap</button>" +
      "<button data-toast='Rental invoices downloaded — prototype' style='width:100%;height:44px;border:none;background:none;color:" + C.navy + ";font-size:14px;font-weight:700;cursor:pointer;margin-top:2px'>Download all rental invoices</button>";
    openSheet(html);
  }
  window.openDevices = openDevices;

  function openCancelDevice() {
    var points = ["Auto-debit stops immediately", "Free return pickup scheduled", "No further charges, ever"].map(function (t) {
      return "<div style='display:flex;align-items:center;gap:9px;padding:6px 0'><span class='material-symbols-outlined' style='color:" + C.green + ";font-size:19px'>check_circle</span><span style='font-size:13px;color:" + C.ink + "'>" + t + "</span></div>";
    }).join("");
    var html =
      "<div style='font-size:18px;font-weight:800;margin:0 2px 3px'>Cancel Soundbox rental?</div>" +
      "<div style='font-size:12px;color:" + C.muted + ";margin:0 2px 14px'>No lock-in · cancel anytime</div>" +
      "<div style='background:#f1f4f6;border-radius:14px;padding:8px 15px;margin-bottom:14px'>" +
        "<div style='display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e3e8ec'><span style='font-size:13px;color:" + C.muted + "'>Current plan</span><span style='font-size:13px;font-weight:700'>₹125 / month</span></div>" +
        "<div style='display:flex;justify-content:space-between;padding:7px 0'><span style='font-size:13px;color:" + C.muted + "'>Next charge (1 Oct)</span><span style='font-size:13px;font-weight:700;color:" + C.green + "'>Will be stopped</span></div></div>" +
      "<div style='padding:0 4px 14px'>" + points + "</div>" +
      "<button data-toast='Rental cancelled · free pickup scheduled · no further charges — prototype' style='width:100%;height:48px;border:none;border-radius:13px;background:#ba1a1a;color:#fff;font-size:15px;font-weight:700;cursor:pointer'>Confirm cancellation</button>" +
      "<button data-close style='width:100%;height:44px;border:none;background:none;color:" + C.muted + ";font-size:14px;font-weight:600;cursor:pointer'>Keep my device</button>";
    openSheet(html);
  }
  window.openCancelDevice = openCancelDevice;

  /* ---------- Tiny inline charts ---------- */
  function barChart(data, w, h) {
    w = w || 320; h = h || 130; var pad = 16;
    var max = Math.max.apply(null, data.map(function (d) { return d.value; })) || 1;
    var gap = (w - pad * 2) / data.length, bw = gap * 0.58;
    var body = data.map(function (d, i) {
      var bh = (h - pad * 2 - 14) * (d.value / max);
      var x = pad + gap * i + (gap - bw) / 2, y = h - pad - bh - 14;
      return "<rect x='" + x.toFixed(1) + "' y='" + y.toFixed(1) + "' width='" + bw.toFixed(1) + "' height='" + Math.max(bh, 2).toFixed(1) + "' rx='4' fill='" + (d.color || C.primary) + "'/>" +
        "<text x='" + (x + bw / 2).toFixed(1) + "' y='" + (h - 4) + "' text-anchor='middle' font-size='9' font-weight='600' fill='" + C.muted + "' font-family='Inter'>" + d.label + "</text>";
    }).join("");
    return "<svg viewBox='0 0 " + w + " " + h + "' width='100%' height='" + h + "' xmlns='http://www.w3.org/2000/svg'>" + body + "</svg>";
  }
  function lineChart(pts, w, h) {
    w = w || 320; h = h || 130; var pad = 18;
    var vals = pts.map(function (p) { return p.v; });
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals), rng = (max - min) || 1, n = pts.length;
    function xs(i) { return pad + (w - pad * 2) * (i / (n - 1)); }
    function ys(v) { return pad + (h - pad * 2 - 12) * (1 - (v - min) / rng); }
    var d = pts.map(function (p, i) { return (i ? "L" : "M") + xs(i).toFixed(1) + " " + ys(p.v).toFixed(1); }).join(" ");
    var area = d + " L" + xs(n - 1).toFixed(1) + " " + (h - pad - 12) + " L" + xs(0).toFixed(1) + " " + (h - pad - 12) + " Z";
    var dots = pts.map(function (p, i) { return "<circle cx='" + xs(i).toFixed(1) + "' cy='" + ys(p.v).toFixed(1) + "' r='3' fill='" + C.primary + "'/>"; }).join("");
    var labels = pts.map(function (p, i) { return "<text x='" + xs(i).toFixed(1) + "' y='" + (h - 3) + "' text-anchor='middle' font-size='9' fill='" + C.muted + "' font-family='Inter'>" + p.label + "</text>"; }).join("");
    return "<svg viewBox='0 0 " + w + " " + h + "' width='100%' height='" + h + "' xmlns='http://www.w3.org/2000/svg'>" +
      "<defs><linearGradient id='fg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='" + C.primary + "' stop-opacity='.25'/><stop offset='1' stop-color='" + C.primary + "' stop-opacity='0'/></linearGradient></defs>" +
      "<path d='" + area + "' fill='url(#fg)'/><path d='" + d + "' fill='none' stroke='" + C.primary + "' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round'/>" + dots + labels + "</svg>";
  }

  /* ---------- Footfall insight ---------- */
  function openFootfall() {
    var wk = [["Mon", 120, C.primary], ["Tue", 78, "#ba1a1a"], ["Wed", 132, C.primary], ["Thu", 128, C.primary], ["Fri", 165, C.primary], ["Sat", 190, C.primary], ["Sun", 96, C.primary]]
      .map(function (d) { return { label: d[0], value: d[1], color: d[2] }; });
    var html =
      "<div style='font-size:18px;font-weight:800;margin:0 2px 2px'>Footfall insight</div>" +
      "<div style='font-size:12px;color:" + C.muted + ";margin:0 2px 12px'>Walk-in customers · weekday average</div>" +
      "<div style='background:#f1f4f6;border-radius:16px;padding:12px 8px 4px;margin-bottom:12px'>" + barChart(wk, 320, 132) + "</div>" +
      "<div style='display:flex;align-items:center;gap:9px;background:rgba(186,26,26,.08);border-radius:12px;padding:12px 13px;margin-bottom:10px'>" +
        "<span class='material-symbols-outlined' style='color:#ba1a1a;font-size:22px'>trending_down</span>" +
        "<span style='font-size:12.5px;color:#7a1414;font-weight:600'>Tuesday walk-ins are down 20% vs last month — your weakest day</span></div>" +
      "<div style='display:flex;align-items:center;gap:9px;background:rgba(22,163,74,.10);border-radius:12px;padding:12px 13px;margin-bottom:14px'>" +
        "<span class='material-symbols-outlined' style='color:" + C.green + ";font-size:22px'>lightbulb</span>" +
        "<span style='font-size:12.5px;color:#0f5132;font-weight:600'>Tip: run a Tuesday combo — Tue shoppers spend ₹340 on average</span></div>" +
      "<button data-toast='Tuesday offer created · customers notified on WhatsApp — prototype' style='width:100%;height:48px;border:none;border-radius:13px;background:" + C.navy + ";color:#fff;font-size:15px;font-weight:700;cursor:pointer'>Create Tuesday offer</button>" +
      "<button data-close style='width:100%;height:42px;border:none;background:none;color:" + C.muted + ";font-size:14px;font-weight:600;cursor:pointer'>Close</button>";
    openSheet(html);
  }
  window.openFootfall = openFootfall;

  /* ---------- Business Khata (credit ledger) ---------- */
  function openKhata() {
    var customers = [
      ["Rajesh Kirana Store", "Last paid 12 days ago", 18200, ""],
      ["Anita General Stores", "Due in 3 days", 9800, ""],
      ["Mohan Traders", "Payment overdue", 8500, "od"],
      ["Priya Textiles", "Due today", 7200, "due"],
      ["Verma Brothers", "Last paid 20 days ago", 4800, ""]
    ];
    var total = customers.reduce(function (s, c) { return s + c[2]; }, 0);
    var rows = customers.map(function (c) {
      var badge = c[3] === "od" ? "<span style='font-size:10px;font-weight:700;color:#ba1a1a;background:rgba(186,26,26,.1);padding:2px 7px;border-radius:99px'>Overdue</span>" :
                  c[3] === "due" ? "<span style='font-size:10px;font-weight:700;color:#8a6d00;background:rgba(245,190,0,.16);padding:2px 7px;border-radius:99px'>Due today</span>" : "";
      return "<div style='display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid #eef1f3'>" +
        "<div style='width:38px;height:38px;border-radius:11px;background:#f1f4f6;display:flex;align-items:center;justify-content:center;font-weight:800;color:" + C.navy + ";flex-shrink:0'>" + c[0].charAt(0) + "</div>" +
        "<div style='flex:1;min-width:0'><div style='font-size:14px;font-weight:700;color:" + C.ink + ";display:flex;align-items:center;gap:6px'>" + c[0] + " " + badge + "</div>" +
        "<div style='font-size:12px;color:" + C.muted + "'>" + c[1] + "</div></div>" +
        "<div style='text-align:right;flex-shrink:0'><div style='font-size:14px;font-weight:800;color:" + C.ink + "'>₹" + fmtAmt(c[2]) + "</div>" +
        "<button data-toast=\"WhatsApp reminder sent to " + c[0] + " — prototype\" style='font-size:11px;font-weight:700;color:" + C.green + ";background:none;border:none;cursor:pointer;padding:2px 0'>Remind →</button></div></div>";
    }).join("");
    var summary = "<div style='background:linear-gradient(135deg," + C.navy + "," + C.primary + ");border-radius:18px;padding:16px;color:#fff;margin-bottom:14px'>" +
      "<div style='font-size:11px;font-weight:700;letter-spacing:.07em;opacity:.9'>YOU'LL RECEIVE</div>" +
      "<div style='font-size:28px;font-weight:800;margin-top:4px'>₹" + fmtAmt(total) + "</div>" +
      "<div style='font-size:12px;opacity:.92;margin-top:2px'>from " + customers.length + " credit customers</div></div>";
    var html = "<div style='font-size:18px;font-weight:800;margin:0 2px 14px'>Business Khata</div>" + summary +
      "<div style='font-size:11px;font-weight:700;letter-spacing:.06em;color:" + C.muted + ";margin:2px 2px 0'>CUSTOMERS WHO OWE YOU</div>" +
      "<div style='margin-bottom:14px'>" + rows + "</div>" +
      "<button data-toast='WhatsApp reminders sent to all 5 customers — prototype' style='width:100%;height:48px;border:none;border-radius:13px;background:" + C.navy + ";color:#fff;font-size:15px;font-weight:700;cursor:pointer'>Send reminders to all · WhatsApp</button>" +
      "<button data-toast='Add khata entry — prototype' style='width:100%;height:44px;border:1.5px solid #e2e9ef;border-radius:13px;background:#fff;color:" + C.navy + ";font-size:14px;font-weight:700;cursor:pointer;margin-top:8px'>+ Add khata entry</button>";
    openSheet(html);
  }
  window.openKhata = openKhata;

  /* ---------- Cash-flow forecast ---------- */
  function openForecast() {
    var pts = [{ label: "Now", v: 82 }, { label: "Wk 1", v: 105 }, { label: "Wk 2", v: 128 }, { label: "Wk 3", v: 90 }, { label: "Wk 4", v: 140 }];
    function stat(k, v, col) {
      return "<div style='display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e3e8ec'>" +
        "<span style='font-size:13px;color:" + C.muted + "'>" + k + "</span>" +
        "<span style='font-size:14px;font-weight:700;color:" + (col || C.ink) + "'>" + v + "</span></div>";
    }
    var html =
      "<div style='display:flex;justify-content:space-between;align-items:start;margin:0 2px 2px'>" +
        "<div style='font-size:18px;font-weight:800'>Cash-flow forecast</div>" +
        "<span style='font-size:10px;font-weight:700;letter-spacing:.05em;color:" + C.navy + ";background:rgba(0,41,112,.08);padding:5px 9px;border-radius:99px'>AI PROJECTED</span></div>" +
      "<div style='font-size:12px;color:" + C.muted + ";margin:0 2px 12px'>Projected balance · next 30 days</div>" +
      "<div style='background:#f1f4f6;border-radius:16px;padding:10px 8px 4px;margin-bottom:12px'>" + lineChart(pts, 320, 130) + "</div>" +
      "<div style='background:#f1f4f6;border-radius:16px;padding:4px 16px;margin-bottom:12px'>" +
        stat("Projected inflow", "₹4,10,000") +
        stat("Projected outflow", "₹3,20,000") +
        stat("Net position", "+₹90,000", C.green) +
        stat("Lowest balance (Wk 3)", "₹90,000") +
      "</div>" +
      "<div style='display:flex;align-items:center;gap:9px;background:rgba(22,163,74,.10);border-radius:12px;padding:12px 13px;margin-bottom:14px'>" +
        "<span class='material-symbols-outlined' style='color:" + C.green + ";font-size:22px'>check_circle</span>" +
        "<span style='font-size:12.5px;color:#0f5132;font-weight:600'>Payroll ₹62,000 due 30 Sep — projected balance ₹1.2L, fully covered</span></div>" +
      "<button data-toast='Statement imported · 142 transactions synced — prototype' style='width:100%;height:48px;border:none;border-radius:13px;background:" + C.navy + ";color:#fff;font-size:15px;font-weight:700;cursor:pointer'>Import bank statement (Excel)</button>" +
      "<button data-toast='Bank linked · live balance sync on — prototype' style='width:100%;height:44px;border:1.5px solid #e2e9ef;border-radius:13px;background:#fff;color:" + C.navy + ";font-size:14px;font-weight:700;cursor:pointer;margin-top:8px'>Link bank for live sync</button>";
    openSheet(html);
  }
  window.openForecast = openForecast;

  /* ---------- Home insight cards ---------- */
  function iCard(accent, icon, tag, title, cta, openAttr) {
    return "<div " + openAttr + " style='min-width:212px;max-width:212px;background:#fff;border:1px solid #e2e9ef;border-left:4px solid " + accent + ";border-radius:14px;padding:12px 13px;cursor:pointer;box-shadow:0 2px 8px rgba(0,41,112,.05)'>" +
      "<div style='display:flex;align-items:center;gap:6px;margin-bottom:6px'><span class='material-symbols-outlined' style='font-size:18px;color:" + accent + "'>" + icon + "</span>" +
      "<span style='font-size:10px;font-weight:700;letter-spacing:.05em;color:" + C.muted + ";text-transform:uppercase'>" + tag + "</span></div>" +
      "<div style='font-size:13px;font-weight:700;color:" + C.ink + ";line-height:1.3;min-height:34px'>" + title + "</div>" +
      "<div style='font-size:12px;font-weight:700;color:" + accent + ";margin-top:7px'>" + cta + " →</div></div>";
  }
  function insightCardsHtml() {
    return iCard("#ba1a1a", "trending_down", "Footfall", "Tuesday walk-ins down 20% vs last month", "See why", "data-open='openFootfall'") +
      iCard(C.navy, "account_balance_wallet", "Receivables", "₹48,500 owed by 5 credit customers", "Open Khata", "data-open='openKhata'") +
      iCard(C.green, "trending_up", "Cash-flow", "+₹90,000 projected net this month", "View forecast", "data-open='openForecast'") +
      iCard("#8a6d00", "description", "Compliance", "GST filing due in 6 days", "Set reminder", "data-toast='GST reminder set — prototype'");
  }

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

    /* 1b. "More" tab -> More menu (with pre-approved loans) */
    document.querySelectorAll('[data-path="more"]').forEach(function (el) {
      el.removeAttribute("href");
      el.style.cursor = "pointer";
      el.dataset.proto = "1";
      el.addEventListener("click", function (e) { e.preventDefault(); openMore(); });
    });

    /* 1c. Top-right profile avatar -> Profile sheet */
    var pfp = document.querySelector('img[alt="Profile"]');
    if (pfp) {
      var target = pfp.closest("div") || pfp;
      target.style.cursor = "pointer";
      target.dataset.proto = "1";
      target.addEventListener("click", function () { openProfile(); });
    }

    /* 1d. Home: inject proactive "Insights for you" strip */
    if (document.getElementById("balanceDisplay")) {
      var mainWrap = document.querySelector("main > div");
      if (mainWrap) {
        var block = document.createElement("div");
        block.style.cssText = "display:flex;flex-direction:column;gap:8px;";
        block.innerHTML =
          "<div style='display:flex;align-items:center;gap:6px;padding:0 2px'>" +
            "<span class='material-symbols-outlined' style='font-size:18px;color:" + C.navy + "'>auto_awesome</span>" +
            "<span style='font-size:13px;font-weight:800;color:" + C.ink + ";font-family:Inter,sans-serif'>Insights for you</span></div>" +
          "<div style='display:flex;gap:10px;overflow-x:auto;padding-bottom:2px'>" + insightCardsHtml() + "</div>";
        var anchor = mainWrap.children[1] || null;
        mainWrap.insertBefore(block, anchor);
        block.querySelectorAll("[data-open]").forEach(function (el) {
          el.dataset.proto = "1";
          el.addEventListener("click", function () { var fn = window[el.getAttribute("data-open")]; if (fn) fn(); });
        });
        block.querySelectorAll("[data-toast]").forEach(function (el) {
          el.dataset.proto = "1";
          el.addEventListener("click", function () { toast(el.getAttribute("data-toast")); });
        });
      }
    }

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

    /* 2b. Add-supplier modal: make the GSTIN / Bank / UPI tabs switch,
           and keep the router from double-handling the modal's controls. */
    var sm = document.getElementById("supplierModal");
    if (sm) {
      var cfg = {
        "GSTIN Number": { label: "Enter Business GSTIN", val: "07AABCB1234F1Z5", up: true,
          sub: "Trade Name: Bharat Flour Mills • New Delhi", msg: "GSTIN 07AABCB1234F1Z5 Active & Verified" },
        "Bank Account": { label: "Enter Account Number & IFSC", val: "5010 0441 2909 / HDFC0000123", up: false,
          sub: "HDFC Bank • A/C ••9087 • Penny-drop verified", msg: "Bank account verified — Bharat Agro Foods" },
        "UPI VPA": { label: "Enter UPI ID (VPA)", val: "bharatagro@okhdfcbank", up: false,
          sub: "bharatagro@okhdfcbank • Verified on UPI", msg: "UPI ID verified — Bharat Agro Foods" }
      };
      /* keep the router away from every control inside the modal + its opener */
      sm.querySelectorAll("button, input").forEach(function (n) { n.dataset.proto = "1"; });
      var opener = document.getElementById("openAddSupplierBtn");
      if (opener) opener.dataset.proto = "1";

      var lbl = sm.querySelector("label");
      var inp = sm.querySelector("#gstinInput") || sm.querySelector("input");
      var preview = sm.querySelector("#verifiedPreviewCard");
      var previewSub = preview ? preview.querySelectorAll("span")[1] : null;
      var tabBtns = Array.prototype.filter.call(sm.querySelectorAll("button"), function (b) {
        return cfg[b.textContent.trim()];
      });
      var verifyMsg = cfg["GSTIN Number"].msg;
      /* the modal's Verify button calls simulateGstLookup() -> reflect the active tab */
      window.simulateGstLookup = function () { toast(verifyMsg); };

      function activateTab(btn) {
        var c = cfg[btn.textContent.trim()];
        if (!c) return;
        tabBtns.forEach(function (t) {
          t.className = "py-1.5 rounded-md font-label-sm text-label-sm " +
            (t === btn ? "bg-surface-container-lowest text-primary shadow-sm font-bold" : "text-on-surface-variant");
        });
        if (lbl) lbl.textContent = c.label;
        if (inp) { inp.value = c.val; inp.style.textTransform = c.up ? "uppercase" : "none"; }
        if (previewSub) previewSub.textContent = c.sub;
        verifyMsg = c.msg;
      }
      tabBtns.forEach(function (btn) {
        btn.style.cursor = "pointer";
        btn.addEventListener("click", function () { activateTab(btn); });
      });
    }

    /* 2c. Records: each transaction opens an itemised settlement breakdown */
    var recHead = Array.prototype.filter.call(document.querySelectorAll("h2"), function (h) {
      return /Recent Transactions/i.test(h.textContent);
    })[0];
    if (recHead) {
      var wrap = recHead.closest(".px-margin-mobile") ||
                 (recHead.parentElement && recHead.parentElement.parentElement) || document.body;
      var txCards = Array.prototype.filter.call(wrap.querySelectorAll('[class*="bg-surface-container-lowest"]'), function (c) {
        return /[+\-]₹/.test(c.textContent) && c.querySelector(".font-headline-sm");
      });
      txCards.forEach(function (c) {
        c.dataset.proto = "1";
        c.style.cursor = "pointer";
        var nm = c.querySelector(".font-label-lg");
        var am = c.querySelector(".font-headline-sm");
        var nameTx = nm ? nm.textContent.trim() : "Transaction";
        var amtTx = am ? am.textContent.trim() : "";
        var isCredit = /^\+/.test(amtTx);
        c.addEventListener("click", function () { openTxnSheet(nameTx, amtTx, isCredit); });
      });
    }

    /* 3. Make EVERY remaining interactive control do something sensible —
          including the <div>/<a> cards Stitch marks with active:scale /
          cursor-pointer. Route the payment & records journeys; toast the rest. */
    function go(url) { return function () { location.href = url; }; }
    function intent(t) {
      t = t.toLowerCase();
      if (/\bmy qr\b|scan any|scan to|show qr|\bqr\b|^collect$/.test(t)) return showQR;
      if (/view ledger|view all.*record/.test(t)) return go(REL.records);
      if (/new payment/.test(t)) return go(REL.pay);
      if (/add .*supplier|new supplier/.test(t)) return function () { toast("Add supplier form — prototype"); };
      if (/confirm.*pay/.test(t)) return go(REL.success);
      if (/pay again|pay now|\bproceed\b|make payment|^pay\b|pay ₹|pay bill|supplier|employee|salar|payroll|\bbill|\brent\b|inventory|utilit|other upi|payout|quick transfer/.test(t))
        return function () { openPaySheet(); };
      return null;
    }
    var SEL = 'button, a[href], [role="button"], [class*="active:scale"], [class*="cursor-pointer"]';
    document.querySelectorAll(SEL).forEach(function (el) {
      if (el.dataset.proto) return;                     /* already wired */
      if (el.id === "pay-button") return;               /* wired to success */
      if (el.hasAttribute("onclick")) return;           /* keep its own handler */
      if (el.closest("[data-path]")) return;            /* bottom-nav, handled */
      el.dataset.proto = "1";
      el.style.cursor = "pointer";
      var label = labelText(el) || "Action";
      var handler = intent(label);
      el.addEventListener("click", function (e) {
        /* ignore clicks that actually belong to a nested interactive child */
        var owner = e.target.closest(SEL + ", [onclick]");
        if (owner && owner !== el) return;
        e.preventDefault();
        if (handler) { handler(); return; }
        var msg = label.length > 34 ? label.slice(0, 34) + "…" : label;
        toast(msg + " — prototype");
      });
    });
  });
})();
