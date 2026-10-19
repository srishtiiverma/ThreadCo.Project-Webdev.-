/* ThreadCo Shopping Assistant — drop-in widget (suggest + compare)
   Add before </body> on every page:  <script src="threadco-assistant.js"></script> */
(function () {
  var BASE = ''; // set to full site URL if pages are in sub-folders
  var P = [
    { n: 'Oversized Drop Tee Vol.3', c: 'tee', p: 799, m: 1199, s: 1, mat: '100% Cotton', sz: 'S, M, L, XL, XXL', r: 4.9, best: 'Everyday wear', re: /drop tee|vol\.?\s*3/ },
    { n: 'Street Hoodie - Olive', c: 'hoodie', p: 1499, m: 1999, s: 1, mat: '80% Cotton, 20% Polyester', sz: 'S, M, L, XL', r: 4.7, best: 'Winter & layering', re: /street hoodie|olive hoodie|hoodie olive/ },
    { n: 'Utility Cargo - Beige', c: 'cargo', p: 1799, m: 2499, s: 1, mat: '100% Cotton Twill', sz: '28, 30, 32, 34, 36', r: 4.6, best: 'Street & utility style', re: /utility|beige/ },
    { n: 'TC 6-Panel Cap - Black', c: 'cap', p: 499, m: 699, s: 1, best: 'Finishing any fit', re: /6.?panel/ },
    { n: 'Monogram Tote Bag - Cream', c: 'tote', p: 349, m: 499, s: 1, best: 'Daily carry & gifting', re: /monogram/ },
    { n: 'Acid Wash Tee - White', c: 'tee', p: 899, m: 1299, s: 0, best: 'Statement tee', re: /acid/ },
    { n: 'Zip-Up Hoodie - Charcoal', c: 'hoodie', p: 1699, m: 2199, s: 1, best: 'Easy layering', re: /zip|charcoal/ },
    { n: 'Street Cargo - Olive', c: 'cargo', p: 1999, m: 2699, s: 1, best: 'Street style', re: /street cargo|olive cargo|cargo olive/ }
  ];
  var CATS = [
    { k: 'tee', re: /t-?shirt|tee/, label: 'T-shirts' },
    { k: 'hoodie', re: /hoodie|sweatshirt/, label: 'hoodies' },
    { k: 'cargo', re: /cargo|pants|trouser|bottom/, label: 'cargo pants' },
    { k: 'cap', re: /\bcaps?\b|hat/, label: 'caps' },
    { k: 'tote', re: /tote|bag|accessor/, label: 'accessories' }
  ];
  var DEFAULT = { tee: 0, hoodie: 1, cargo: 2, cap: 3, tote: 4 };
  var off = function (x) { return Math.round((1 - x.p / x.m) * 100); };
  var inr = function (v) { return '₹ ' + v; };

  function find(q) {
    var items = [];
    P.forEach(function (x, i) { var m = q.match(x.re); if (m) items.push({ i: m.index, x: x }); });
    CATS.forEach(function (c) {
      var m = q.match(c.re);
      if (m && !items.some(function (t) { return t.x.c === c.k; })) items.push({ i: m.index, x: P[DEFAULT[c.k]] });
    });
    items.sort(function (a, b) { return a.i - b.i; });
    var out = [];
    items.forEach(function (t) { if (out.indexOf(t.x) < 0) out.push(t.x); });
    return out;
  }

  function card(x) {
    return '<div class="tcai-card"><b>' + x.n + '</b><br>' + inr(x.p) + ' <s>' + inr(x.m) + '</s> · ' + off(x) + '% off' +
      (x.r ? ' · ★ ' + x.r : '') + (x.s ? '' : ' · <i>Sold out</i>') +
      '<br><a href="' + BASE + 'product.html">View details →</a></div>';
  }

  function compare(list) {
    var rows = [['Price', function (x) { return inr(x.p) + ' (' + off(x) + '% off)'; }],
      ['Material', function (x) { return x.mat || '—'; }],
      ['Sizes', function (x) { return x.sz || '—'; }],
      ['Rating', function (x) { return x.r ? '★ ' + x.r : '—'; }],
      ['Best for', function (x) { return x.best; }],
      ['Stock', function (x) { return x.s ? 'In stock' : 'Sold out'; }]];
    var h = '<div class="tcai-scroll"><table class="tcai-t"><tr><th></th>' + list.map(function (x) { return '<th>' + x.n + '</th>'; }).join('') + '</tr>';
    rows.forEach(function (r) { h += '<tr><td>' + r[0] + '</td>' + list.map(function (x) { return '<td>' + r[1](x) + '</td>'; }).join('') + '</tr>'; });
    h += '</table></div>';
    var a = list[0], b = list[1], pick;
    if (list.length === 2) {
      pick = (a.r && b.r && a.r !== b.r) ? (a.r > b.r ? a : b) : (a.p < b.p ? a : b);
      h += '<p>My take: <b>' + pick.n + '</b> is the safer pick' + ((a.r && b.r && a.r !== b.r) ? ' (higher rated)' : ' (lower price)') +
        '. Choose the other if you want ' + (pick === a ? b : a).best.toLowerCase() + '.</p>';
    }
    return h;
  }

  function reply(raw) {
    var q = raw.toLowerCase();
    if (/^(hi|hello|hey|yo)\b/.test(q)) return 'Hey! 👋 Tell me what you\'re after (e.g. <i>hoodie under 1500</i>) or ask me to compare two pieces.';
    if (/deliver|ship|return|refund|exchange/.test(q))
      return 'Free delivery above ₹ 499, orders ship in 48 hours, and returns are free within 7 days.';
    if (/size|fit/.test(q) && !find(q).length)
      return 'Tees: S–XXL (oversized fit). Hoodies: S–XL. Cargos: waist 28–36. Between sizes? Size up for the oversized look.';

    var found = find(q);
    var cmp = /compare|vs\b|versus|difference|between|\bor\b|better/.test(q);
    if (cmp && found.length >= 2) return compare(found.slice(0, 3));
    if (cmp && found.length < 2) return 'Which two should I compare? For example: <i>compare Drop Tee and Street Hoodie</i>.';

    var bud = q.match(/(?:under|below|within|upto|up to|less than|<)\s*₹?\s*(\d{3,5})/) || q.match(/₹\s*(\d{3,5})/) || q.match(/(\d{3,5})\s*(?:budget|max|rs|rupees)/);
    var cap = bud ? +bud[1] : null;
    var cats = CATS.filter(function (c) { return c.re.test(q); }).map(function (c) { return c.k; });
    if (/winter|cold|layer|warm/.test(q)) cats = ['hoodie'];
    var gift = /gift|present/.test(q);
    var list = P.filter(function (x) {
      return (!cats.length || cats.indexOf(x.c) >= 0) && (!cap || x.p <= cap) && x.s;
    });
    if (gift) list = P.filter(function (x) { return x.s && x.p <= (cap || 1000); });

    var any = cats.length || cap || gift || /cheap|budget|deal|discount|offer|best|popular|top|recommend|suggest|show|want|need|looking/.test(q);
    if (!any) return 'I can suggest products by category, budget or occasion, and compare any two. Try: <i>best hoodie under 1600</i> or <i>compare tee vs cargo</i>.';
    if (!list.length) return 'Nothing in stock matches that' + (cap ? ' under ' + inr(cap) : '') + '. Want me to widen the budget? Our cheapest piece is the Tote at ' + inr(349) + '.';

    if (/cheap|budget|lowest/.test(q)) list.sort(function (a, b) { return a.p - b.p; });
    else if (/deal|discount|offer|sale/.test(q)) list.sort(function (a, b) { return off(b) - off(a); });
    else list.sort(function (a, b) { return (b.r || 4.5) - (a.r || 4.5); });

    var top = list.slice(0, 3);
    var intro = 'Here ' + (top.length > 1 ? 'are my top ' + top.length + ' picks' : 'is my pick') + (cap ? ' under ' + inr(cap) : '') + ':';
    var out = '<p>' + intro + '</p>' + top.map(card).join('');
    if (top.length > 1) out += '<p>Want a side-by-side? Say <i>compare ' + top[0].n.split(' - ')[0] + ' and ' + top[1].n.split(' - ')[0] + '</i>.</p>';
    if (!P.filter(function (x) { return !x.s; }).every(function (x) { return top.indexOf(x) < 0; })) { /* sold-out never shown */ }
    return out;
  }

  var css = '#tcai-fab{position:fixed;right:18px;bottom:18px;z-index:99999;background:#c6ff3d;color:#000;border:0;border-radius:30px;padding:12px 18px;font:700 14px system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.35)}' +
    '#tcai-box{position:fixed;right:18px;bottom:78px;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 100px);z-index:99999;background:#111;color:#eee;border-radius:16px;display:none;flex-direction:column;overflow:hidden;font:14px/1.45 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5)}' +
    '#tcai-box.open{display:flex}#tcai-head{padding:12px 14px;background:#000;font-weight:700;display:flex;justify-content:space-between}' +
    '#tcai-head span{color:#c6ff3d}#tcai-x{background:none;border:0;color:#eee;font-size:18px;cursor:pointer}' +
    '#tcai-log{flex:1;overflow-y:auto;padding:12px}.tcai-m{margin:0 0 10px;padding:9px 12px;border-radius:12px;max-width:92%}' +
    '.tcai-b{background:#222}.tcai-u{background:#c6ff3d;color:#000;margin-left:auto;width:fit-content}.tcai-m p{margin:0 0 6px}' +
    '.tcai-card{background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:8px 10px;margin:6px 0}.tcai-card a{color:#c6ff3d}' +
    '.tcai-scroll{overflow-x:auto}.tcai-t{border-collapse:collapse;font-size:12px;min-width:100%}.tcai-t th,.tcai-t td{border:1px solid #333;padding:5px 6px;text-align:left;vertical-align:top}.tcai-t th{background:#1a1a1a}' +
    '#tcai-chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 8px}#tcai-chips button{background:#222;color:#eee;border:1px solid #444;border-radius:14px;padding:5px 10px;font-size:12px;cursor:pointer}' +
    '#tcai-f{display:flex;border-top:1px solid #333}#tcai-in{flex:1;background:#111;color:#eee;border:0;padding:12px;font-size:14px;outline:none}' +
    '#tcai-go{background:#c6ff3d;border:0;padding:0 16px;font-weight:700;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var wrap = document.createElement('div');
  wrap.innerHTML = '<button id="tcai-fab">✨ Ask ThreadCo AI</button><div id="tcai-box"><div id="tcai-head"><div>ThreadCo <span>AI</span> Stylist</div><button id="tcai-x" aria-label="Close">×</button></div>' +
    '<div id="tcai-log"></div><div id="tcai-chips"></div><div id="tcai-f"><input id="tcai-in" placeholder="Ask for a pick or a comparison…" autocomplete="off"><button id="tcai-go">Send</button></div></div>';
  document.body.appendChild(wrap);
  var $ = function (id) { return document.getElementById(id); };
  var log = $('tcai-log');

  function add(html, cls) {
    var d = document.createElement('div'); d.className = 'tcai-m ' + cls; d.innerHTML = html;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function send(t) {
    t = (t || '').trim(); if (!t) return;
    var u = document.createElement('div'); u.className = 'tcai-m tcai-u'; u.textContent = t; log.appendChild(u);
    setTimeout(function () { add(reply(t), 'tcai-b'); }, 350);
  }
  ['Best hoodie under 1600', 'Compare Drop Tee and Street Hoodie', 'Biggest discounts', 'Gift under 500'].forEach(function (c) {
    var b = document.createElement('button'); b.textContent = c; b.onclick = function () { send(c); };
    $('tcai-chips').appendChild(b);
  });
  $('tcai-fab').onclick = function () {
    $('tcai-box').classList.toggle('open');
    if (!log.children.length) add('Hey, I\'m the ThreadCo stylist. I can <b>suggest</b> pieces by budget or occasion and <b>compare</b> any two.', 'tcai-b');
  };
  $('tcai-x').onclick = function () { $('tcai-box').classList.remove('open'); };
  $('tcai-go').onclick = function () { var i = $('tcai-in'); send(i.value); i.value = ''; };
  $('tcai-in').onkeydown = function (e) { if (e.key === 'Enter') $('tcai-go').click(); };
})();
