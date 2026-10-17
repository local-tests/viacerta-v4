/*
 * CONFIGURAÇÃO DO SITE — Via Certa Internet
 * Edite aqui links e contatos sem mexer no restante do código.
 * Campos vazios ('') escondem automaticamente os botões correspondentes
 * ou redirecionam para o WhatsApp.
 *
 * Os links abaixo vieram da página oficial de contatos da empresa
 * (bit.ly/m/contatos-viacertadigital), em 12/10/2026.
 */
window.VIA_CERTA = {
  whatsapp: '5554999821015',          // só números, com DDI 55 + DDD
  telefone: '(54) 99982-1015',

  // Área do Assinante (login do cliente)
  areaClienteUrl: 'https://sac.bitcom.com.br/sac/login/?sys=SAC',
  // Link direto da 2ª via. Se vazio, usa a Área do Assinante; se ela também estiver vazia, abre o WhatsApp.
  segundaViaUrl: '',
  testeVelocidadeUrl: 'https://www.speedtest.net/pt',

  app: {
    android: 'https://play.google.com/store/apps/details?id=com.mksolutions.sacplus.bitcom',
    ios: 'https://apps.apple.com/br/app/bitcom/id1618286901'
  },

  redes: {
    instagram: 'https://www.instagram.com/viacertadigital/',
    facebook: 'https://www.facebook.com/viacertadigital',
    tiktok: 'https://www.tiktok.com/@viacertadigital_internet'
  },

  google: {
    // Perfil da empresa no Google Maps
    mapsUrl: 'https://maps.google.com/?cid=17424395109808089907',

    // Avaliações AO VIVO (opcional): preencha os dois campos abaixo.
    // placeId: ID do local (ChIJ...) — https://developers.google.com/maps/documentation/places/web-service/place-id
    // apiKey: chave da "Maps JavaScript API" com "Places API (New)" ativada, restrita ao domínio do site.
    // Enquanto estiverem vazios, o site mostra a nota e as avaliações escritas no index.html.
    placeId: '',
    apiKey: ''
  }
};
