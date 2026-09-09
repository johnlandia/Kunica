(function(){
'use strict';
function enhance(){
  var root=document.getElementById('dionuel-phase1-store'); if(!root)return;
  var shell=root.querySelector('.sf-shell'); if(!shell)return;
  var oldHero=root.querySelector('.sf-hero');
  if(oldHero){oldHero.querySelector('.sf-hero-card').innerHTML='<div class="sf-hero-art"><span>ATELIER</span><strong>Peças únicas.<br>Feitas para si.</strong><small>Confeção personalizada em Luanda</small></div>';}
  var tools=document.createElement('section'); tools.className='sf-tools'; tools.innerHTML='<div class="sf-search"><span>⌕</span><input id="sf-search" type="search" placeholder="Pesquisar uma peça..." aria-label="Pesquisar uma peça"></div><div class="sf-quick"><button data-quick="all">Todas</button><button data-quick="fato">Fatos</button><button data-quick="safari">Safari</button><button data-quick="camisa">Camisas</button><button data-quick="vestido">Vestidos</button></div>';
  var collection=root.querySelector('.sf-section'); collection.parentNode.insertBefore(tools,collection);
  var search=tools.querySelector('#sf-search');
  function filter(){var q=(search.value||'').toLowerCase().trim();root.querySelectorAll('.sf-product').forEach(function(card){var text=card.textContent.toLowerCase();card.style.display=!q||text.indexOf(q)>=0?'flex':'none';});}
  search.addEventListener('input',filter);
  tools.querySelectorAll('[data-quick]').forEach(function(b){b.onclick=function(){var target=b.dataset.quick;var cat=root.querySelector('.sf-cat[data-cat="'+target+'"]');if(cat)cat.click();}});
  var count=root.querySelector('#sf-count'); if(count) count.title='Produtos publicados no catálogo DIONUEL';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(enhance,100)});else setTimeout(enhance,100);
})();