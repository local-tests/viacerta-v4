(function () {
  'use strict';

  var cfg = window.VIA_CERTA || {};
  var g = cfg.google || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var isPhone = window.matchMedia('(max-width: 720px)');
  var SPRITE = ''; // os ícones ficam dentro de cada página (<use href="#i-nome">)

  function waLink(msg) {
    return 'https://wa.me/' + (cfg.whatsapp || '5554999821015') + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }

  function openWhatsApp(url) {
    var win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // navegador bloqueou a nova aba: abre na mesma
  }

  /* ---------- Janelas (dialog) ---------- */
  function setupSheet(sheet) {
    $$('[data-close-sheet]', sheet).forEach(function (el) {
      el.addEventListener('click', function () { sheet.close(); });
    });
    sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
  }
  $$('dialog.sheet').forEach(setupSheet);

  /* ---------- Área do Assinante ---------- */
  var sheet = $('#area-cliente');

  function openCliente() {
    closeMenu();
    if (sheet && typeof sheet.showModal === 'function') sheet.showModal();
    else if (cfg.areaClienteUrl) window.location.href = cfg.areaClienteUrl;
  }
  $$('[data-open-cliente]').forEach(function (el) { el.addEventListener('click', openCliente); });

  /* ---------- Cidade do contato ----------
     Todo link com data-wa abre esta janela. A cidade escolhida entra no lugar de {cidade} na mensagem.
     data-wa-ctx muda a pergunta (casa, empresa, evento, cliente, geral).
     data-wa-direto pula a pergunta. */
  var cityDialog = $('#escolher-cidade');
  var CTX = {
    casa:    ['Onde você mora?',            'Moro em Nova Araçá',              'Moro em Paraí',              'Moro em outra cidade'],
    empresa: ['Onde fica a sua empresa?',   'Em Nova Araçá',                   'Em Paraí',                   'Em outra cidade'],
    evento:  ['Onde será o evento?',        'Em Nova Araçá',                   'Em Paraí',                   'Em outra cidade da região'],
    cliente: ['Onde fica a sua conexão?',   'Em Nova Araçá',                   'Em Paraí',                   'Em outra cidade'],
    geral:   ['De onde você fala?',         'Sou de Nova Araçá',               'Sou de Paraí',               'Sou de outra cidade']
  };
  var pendingMsg = '';

  function lastCity() { try { return sessionStorage.getItem('vc-cidade') || ''; } catch (e) { return ''; } }
  function saveCity(c) { try { sessionStorage.setItem('vc-cidade', c); } catch (e) { /* sem armazenamento: tudo bem */ } }

  function sendWithCity(city) {
    saveCity(city);
    var msg = pendingMsg.indexOf('{cidade}') > -1 ? pendingMsg.replace(/\{cidade\}/g, city) : pendingMsg + ' Cidade: ' + city + '.';
    cityDialog.close();
    openWhatsApp(waLink(msg));
  }

  function askCity(msg, ctx) {
    var texts = CTX[ctx] || CTX.geral;
    pendingMsg = msg;
    $('[data-city-title]', cityDialog).textContent = texts[0];
    $$('[data-city-label]', cityDialog).forEach(function (el) { el.textContent = texts[1 + Number(el.getAttribute('data-city-label'))]; });
    var last = lastCity();
    $$('[data-city]', cityDialog).forEach(function (b) { b.classList.toggle('is-last', b.getAttribute('data-city') === last); });
    var form = $('[data-city-form]', cityDialog);
    form.hidden = true;
    form.reset();
    $('[data-city-other]', cityDialog).setAttribute('aria-expanded', 'false');
    closeMenu();
    if (sheet && sheet.open) sheet.close();
    cityDialog.showModal();
  }

  if (cityDialog && typeof cityDialog.showModal === 'function') {
    $$('[data-city]', cityDialog).forEach(function (b) {
      b.addEventListener('click', function () { sendWithCity(b.getAttribute('data-city')); });
    });
    var other = $('[data-city-other]', cityDialog);
    var otherForm = $('[data-city-form]', cityDialog);
    other.addEventListener('click', function () {
      otherForm.hidden = false;
      other.setAttribute('aria-expanded', 'true');
      $('input', otherForm).focus();
    });
    otherForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = $('input', otherForm).value.trim();
      if (val) sendWithCity(val);
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[data-wa]');
      if (!link || link.hasAttribute('data-wa-direto')) return;
      e.preventDefault();
      askCity(link.getAttribute('data-wa'), link.getAttribute('data-wa-ctx'));
    });
  }

  // href real (sem a cidade) para quem abre o link em nova aba ou sem JavaScript
  $$('[data-wa]').forEach(function (el) {
    el.href = waLink(el.getAttribute('data-wa').replace(/ ?(?:Moro em|Sou de|em) \{cidade\}\.?/g, '').replace(/\{cidade\}/g, ''));
  });

  /* ---------- Links configuráveis ---------- */
  var app = cfg.app || {};
  var isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
  var links = {
    areaCliente: cfg.areaClienteUrl,
    segundaVia: cfg.segundaViaUrl || cfg.areaClienteUrl || waLink('Olá! Sou cliente da Via Certa Internet e preciso da 2ª via da minha fatura.'),
    testeVelocidade: cfg.testeVelocidadeUrl,
    googleMaps: g.mapsUrl,
    googleAvaliar: g.placeId ? 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(g.placeId) : g.mapsUrl,
    appAndroid: app.android,
    appIos: app.ios,
    appAuto: isApple ? (app.ios || app.android) : (app.android || app.ios),
    instagram: cfg.redes && cfg.redes.instagram,
    facebook: cfg.redes && cfg.redes.facebook,
    tiktok: cfg.redes && cfg.redes.tiktok
  };

  $$('[data-link]').forEach(function (el) {
    var url = links[el.getAttribute('data-link')];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });
  $$('[data-requires]').forEach(function (el) {
    if (!links[el.getAttribute('data-requires')]) el.hidden = true;
  });

  /* ---------- Menu mobile ---------- */
  var toggle = $('.nav-toggle');
  var menu = $('#menu');

  function closeMenu() {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) closeMenu(); });
  }

  /* ---------- Planos: carrossel no celular ---------- */
  var plansGrid = $('[data-plans]');
  var planBtns = $$('[data-plan-go]');

  if (plansGrid && planBtns.length) {
    var cards = $$('.plan', plansGrid);
    var planOffset = function (card) { return card.offsetLeft - (plansGrid.clientWidth - card.offsetWidth) / 2; };

    planBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        plansGrid.scrollTo({ left: planOffset(cards[Number(btn.getAttribute('data-plan-go'))]), behavior: 'smooth' });
      });
    });

    var ticking = false;
    plansGrid.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var center = plansGrid.scrollLeft + plansGrid.clientWidth / 2;
        var best = 0;
        cards.forEach(function (c, i) {
          var mid = c.offsetLeft + c.offsetWidth / 2;
          var bestMid = cards[best].offsetLeft + cards[best].offsetWidth / 2;
          if (Math.abs(mid - center) < Math.abs(bestMid - center)) best = i;
        });
        planBtns.forEach(function (b, i) {
          b.setAttribute('aria-pressed', String(i === best));
        });
        ticking = false;
      });
    }, { passive: true });

    // No celular, abre no plano em destaque com os vizinhos aparecendo nas bordas
    var centerFeatured = function () {
      if (!isPhone.matches) return;
      var featured = $('.plan--featured', plansGrid);
      if (featured) plansGrid.scrollLeft = planOffset(featured);
    };
    centerFeatured();
    window.addEventListener('load', centerFeatured);
  }

  /* ---------- Avaliações do Google ao vivo (Places API New) ---------- */
  var track = $('[data-reviews]');

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderLive(place) {
    var nota = Number(place.rating || 5).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    $$('[data-g-nota]').forEach(function (el) { el.textContent = nota; });
    if (place.userRatingCount) $$('[data-g-total]').forEach(function (el) { el.textContent = place.userRatingCount; });
    var quando = $('[data-g-quando]');
    if (quando) quando.textContent = 'ao vivo';

    var reviews = (place.reviews || []).filter(function (r) { return r.text; });
    if (!reviews.length) return;
    var tones = ['', ' review__avatar--dark', ' review__avatar--wine', ' review__avatar--gray'];
    track.innerHTML = reviews.map(function (r, i) {
      var a = r.authorAttribution || {};
      var name = esc(a.displayName);
      var avatar = a.photoURI ? '<img src="' + esc(a.photoURI) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : esc((a.displayName || '?').charAt(0).toUpperCase());
      var stars = '';
      for (var s = 0; s < 5; s++) stars += '<svg' + (s < Math.round(r.rating || 5) ? '' : ' style="opacity:.25"') + '><use href="' + SPRITE + '#i-star"/></svg>';
      return '<article class="review"><div class="review__head">' +
        '<span class="review__avatar' + tones[i % tones.length] + '">' + avatar + '</span>' +
        '<div class="review__who"><p class="review__name">' + (a.uri ? '<a href="' + esc(a.uri) + '" target="_blank" rel="noopener">' + name + '</a>' : name) + '</p>' +
        '<p class="review__when">' + esc(r.relativePublishTimeDescription || 'Avaliação no Google') + '</p></div>' +
        '<svg class="review__g" aria-hidden="true"><use href="' + SPRITE + '#i-google"/></svg></div>' +
        '<span class="stars" role="img" aria-label="' + (r.rating || 5) + ' de 5 estrelas">' + stars + '</span>' +
        '<p class="review__text">' + esc(r.text) + '</p></article>';
    }).join('');
    var source = $('[data-reviews-source]');
    if (source) source.textContent = 'Avaliações fornecidas pelo Google';
  }

  function loadLiveReviews() {
    window.__vcMapsReady = function () {
      google.maps.importLibrary('places').then(function (lib) {
        var place = new lib.Place({ id: g.placeId, requestedLanguage: 'pt-BR' });
        return place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews'] }).then(function () { renderLive(place); });
      }).catch(function (err) {
        if (window.console) console.warn('Avaliações do Google indisponíveis:', err);
      });
    };
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(g.apiKey) + '&v=weekly&loading=async&libraries=places&language=pt-BR&callback=__vcMapsReady';
    s.async = true;
    document.head.appendChild(s);
  }

  if (g.apiKey && g.placeId && track) {
    if ('IntersectionObserver' in window) {
      var lazy = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { lazy.disconnect(); loadLiveReviews(); }
      }, { rootMargin: '600px 0px' });
      lazy.observe(track);
    } else {
      loadLiveReviews();
    }
  }

  function scrollReviews(dir) {
    var card = track && track.querySelector('.review');
    if (!card) return;
    track.scrollBy({ left: dir * (card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24)), behavior: 'smooth' });
  }
  var prev = $('[data-reviews-prev]');
  var next = $('[data-reviews-next]');
  if (prev) prev.addEventListener('click', function () { scrollReviews(-1); });
  if (next) next.addEventListener('click', function () { scrollReviews(1); });

  /* ---------- Formulários → WhatsApp ---------- */
  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  $$('[data-mask="phone"]').forEach(function (input) {
    input.addEventListener('input', function () { input.value = maskPhone(input.value); });
  });

  function validate(form) {
    var firstInvalid = null;
    $$('input, select', form).forEach(function (el) {
      if (!el.required) return;
      var wrap = el.type === 'checkbox' ? el.closest('.check') : el.closest('.field');
      var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
      if (ok && el.getAttribute('data-mask') === 'phone') ok = el.value.replace(/\D/g, '').length >= 10;
      if (wrap) wrap.classList.toggle('is-invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    var error = $('.form-error', form);
    if (firstInvalid) {
      error.textContent = 'Confira os campos destacados para continuar.';
      error.hidden = false;
      firstInvalid.focus();
      return false;
    }
    error.hidden = true;
    return true;
  }

  function picked(form) {
    return $$('input[name="necessidade"]:checked', form).map(function (c) { return c.value; });
  }

  function fmtDate(v) {
    var p = v.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v;
  }

  var builders = {
    indicacao: function (f) {
      return [
        'Olá! Quero fazer uma indicação no *Indique e Ganhe* da Via Certa Internet.', '',
        '*Quem indica*', 'Nome: ' + f.nome.value.trim(), 'WhatsApp: ' + f.telefone.value.trim(), '',
        '*Amigo indicado*', 'Nome: ' + f.amigo.value.trim(), 'WhatsApp: ' + f.amigoTelefone.value.trim(), 'Cidade: ' + f.cidade.value, '',
        '✔ Sou cliente ativo da Via Certa Internet.', '✔ Tenho autorização da pessoa indicada para compartilhar os dados.'
      ].join('\n');
    },
    cobertura: function (f) {
      return [
        'Olá! Quero saber se a Via Certa Internet atende o meu endereço.', '',
        'Nome: ' + f.nome.value.trim(),
        'Endereço: ' + f.rua.value.trim() + ', ' + f.numero.value.trim() + ' – ' + f.bairro.value.trim(),
        'Cidade: ' + f.cidade.value.trim(),
        'WhatsApp: ' + f.telefone.value.trim()
      ].join('\n');
    },
    empresa: function (f, form) {
      var n = picked(form);
      return [
        'Olá! Quero uma proposta de internet para minha empresa.', '',
        'Nome: ' + f.nome.value.trim(), 'Empresa: ' + f.empresa.value.trim(), 'Cidade: ' + f.cidade.value.trim(),
        n.length ? 'Precisamos de: ' + n.join(', ') : '',
        'WhatsApp: ' + f.telefone.value.trim()
      ].filter(Boolean).join('\n');
    },
    evento: function (f, form) {
      var n = picked(form);
      return [
        'Olá! Quero um orçamento de internet para um evento.', '',
        'Evento: ' + f.tipo.value, 'Data: ' + fmtDate(f.data.value), 'Cidade: ' + f.cidade.value.trim(),
        f.local.value.trim() ? 'Local: ' + f.local.value.trim() : '',
        'Público estimado: ' + f.publico.value,
        n.length ? 'Precisa de: ' + n.join(', ') : '',
        '', 'Nome: ' + f.nome.value.trim(), 'WhatsApp: ' + f.telefone.value.trim()
      ].filter(function (l, i, a) { return l !== '' || (a[i - 1] && a[i - 1] !== ''); }).join('\n');
    }
  };

  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var url = waLink(builders[form.getAttribute('data-form')](form.elements, form));
      var done = $('.form-done', form);
      if (done) { $('[data-form-wa]', done).href = url; done.hidden = false; }
      var win = window.open(url, '_blank');
      if (win) win.opener = null;
    });
    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field, .check');
      if (wrap) wrap.classList.remove('is-invalid');
      e.target.removeAttribute('aria-invalid');
    });
  });

  // Data do evento: não deixa escolher dia que já passou
  $$('input[type="date"]').forEach(function (el) {
    var d = new Date();
    el.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  });

  /* ---------- Esconde a barra inferior enquanto a pessoa digita ---------- */
  document.addEventListener('focusin', function (e) {
    if (e.target.matches('input:not([type="checkbox"]), select, textarea')) document.body.classList.add('is-typing');
  });
  document.addEventListener('focusout', function () { document.body.classList.remove('is-typing'); });

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
