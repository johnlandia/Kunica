(function(){'use strict';
function init(){
  if(!document.body||document.querySelector('.store-v2-quick'))return;
  var vitrine=document.querySelector('.vitrine');
  if(!vitrine)return;
  var quick=document.createElement('div');quick.className='store-v2-quick';
  quick.innerHTML='<div class="store-v2-quick-inner"><span class="store-v2-quick-label">Comprar</span><a class="store-v2-action primary" href="#catalogo">Ver coleção</a><a class="store-v2-action" href="#servicos">Sob medida</a><a class="store-v2-action" href="https://wa.me/244932020351" target="_blank" rel="noopener">Consultor WhatsApp</a><div class="store-v2-search"><input type="search" aria-label="Pesquisar na loja" placeholder="Pesquisar produto ou serviço…"></div></div>';
  var hero=vitrine.querySelector('.vitrine-hero'); if(hero)hero.after(quick); else vitrine.prepend(quick);
  var trust=document.createElement('div');trust.className='store-v2-trust';trust.innerHTML='<div class="store-v2-trust-item"><strong>✦ Sob medida</strong><span>Peças pensadas para o seu corpo e ocasião.</span></div><div class="store-v2-trust-item"><strong>✓ Atendimento direto</strong><span>Fale com a equipa antes de comprar.</span></div><div class="store-v2-trust-item"><strong>◆ Processo acompanhado</strong><span>Acompanhe a sua encomenda do pedido à entrega.</span></div>';
  var sec=vitrine.querySelector('.vitrine-secao'); if(sec)sec.before(trust);
  var input=quick.querySelector('input');
  input.addEventListener('input',function(){var q=input.value.trim().toLowerCase();document.querySelectorAll('.produto-card').forEach(function(card){card.classList.toggle('store-v2-hidden',!!q&&!card.textContent.toLowerCase().includes(q));});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
