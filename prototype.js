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
        tile("speaker", "Devices", "data-toast='Soundbox and Devices — prototype'") +
        tile("groups", "Staff", "data-toast='Staff and Roles — prototype'") +
        tile("support_agent", "Help", "data-toast='Help and Support — prototype'") +
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
      row("support_agent", "Help &amp; Support", "data-toast='Help and Support — prototype'") +
      row("logout", "Log Out", "data-toast='Logged out — prototype'", "#ba1a1a");
    openSheet(head + kyc + rows);
  }
  window.openProfile = openProfile;

  /* ---------- Payment options (shown before the review screen) ---------- */
  function fmtAmt(n) {
    n = String(n).replace(/[^\d]/g, "");
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
