/* DIONUEL — ajustes de apresentação sem alterar lógica de negócio. */
(function(){
  const limparEmojis = (root) => {
    if(!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.nodeValue && /[\u{1F300}-\u{1FAFF}]/u.test(node.nodeValue)){
        node.nodeValue=node.nodeValue.replace(/[\u{1F300}-\u{1FAFF}]/gu,'').replace(/\s{2,}/g,' ').trim();
      }
    });
  };
  const init=()=>{
    limparEmojis(document.body);
    const observer=new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{
      if(n.nodeType===1) limparEmojis(n);
      else if(n.nodeType===3 && /[\u{1F300}-\u{1FAFF}]/u.test(n.nodeValue||'')) n.nodeValue=n.nodeValue.replace(/[\u{1F300}-\u{1FAFF}]/gu,'').replace(/\s{2,}/g,' ').trim();
    })));
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
