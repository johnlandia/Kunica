/* DIONUEL MENTOR — primeira camada de inteligência de gestão */
async function renderMentorCeoTab(container){
  container.innerHTML = '<div class="loading-screen">A analisar o atelier…</div>';
  try{
    const [{data: obras,error:e1},{data: despesas,error:e2},{data: contas,error:e3},{data: materiais,error:e4},{data: encomendas,error:e5},{data: contactos,error:e6},{data: custosFixos,error:e7},{data: precos,error:e8}] = await Promise.all([
      sb.from('obras').select('id,cliente_nome,tipo_servico,valor_a_pagar,valor_pago,estado,custo_materiais,custo_producao,tempo_producao_horas,criado_em'),
      sb.from('despesas').select('id,tipo_despesa,valor,valor_pago,data_despesa,criado_em'),
      sb.from('contas_a_pagar').select('id,fornecedor,descricao,valor,valor_pago,data_vencimento,estado'),
      sb.from('materiais').select('id,nome,quantidade_atual,quantidade_minima,preco_unitario'),
      sb.from('encomendas').select('id,cliente_nome,valor_total,moeda,estado,criado_em'),
      sb.from('contactos_interessados').select('id,telefone,origem,criado_em'),
      sb.from('custos_fixos').select('id,descricao,valor_mensal'),
      sb.from('tipos_pecas_precificacao').select('*').order('tipo')
    ]);
    [e1,e2,e3,e4,e5,e6,e7,e8].forEach(e=>{if(e) throw e;});
    const hoje=new Date(), inicio=new Date(hoje.getFullYear(),hoje.getMonth(),1), fim=new Date(hoje.getFullYear(),hoje.getMonth()+1,1);
    const mes=(obras||[]).filter(o=>{const d=new Date(o.criado_em);return d>=inicio&&d<fim;});
    const receita=mes.reduce((s,o)=>s+Number(o.valor_pago||0),0), faturado=mes.reduce((s,o)=>s+Number(o.valor_a_pagar||0),0);
    const custo=mes.reduce((s,o)=>s+Number(o.custo_materiais||0)+Number(o.custo_producao||0),0);
    const despesasMes=(despesas||[]).filter(d=>{const dt=new Date(d.criado_em||d.data_despesa);return dt>=inicio&&dt<fim;}).reduce((s,d)=>s+Number(d.valor_pago||d.valor||0),0);
    const fixos=(custosFixos||[]).reduce((s,c)=>s+Number(c.valor_mensal||0),0), resultado=receita-custo-despesasMes;
    const margem=faturado>0?((faturado-custo)/faturado)*100:0;
    const atrasadas=(obras||[]).filter(o=>o.estado==='por_concluir').length;
    const vencidas=(contas||[]).filter(c=>c.estado!=='pago'&&c.data_vencimento&&new Date(c.data_vencimento+'T23:59:59')<hoje).length;
    const stockBaixo=(materiais||[]).filter(m=>Number(m.quantidade_atual||0)<=Number(m.quantidade_minima||0));
    const pendentes=(encomendas||[]).filter(e=>!['confirmado','cancelado'].includes(e.estado)).length;
    const alertas=[];
    if(atrasadas) alertas.push('Há <strong>'+atrasadas+'</strong> obras por concluir. Verifique prazos e capacidade antes de aceitar urgências.');
    if(vencidas) alertas.push('Existem <strong>'+vencidas+'</strong> contas a pagar vencidas. Reveja o caixa antes de novas compras.');
    if(stockBaixo.length) alertas.push('<strong>'+stockBaixo.length+'</strong> materiais estão no mínimo ou abaixo dele: '+stockBaixo.slice(0,4).map(m=>esc(m.nome)).join(', ')+(stockBaixo.length>4?'…':'')+'.');
    if(margem>0&&margem<30) alertas.push('A margem bruta estimada das obras deste mês está em <strong>'+margem.toFixed(1)+'%</strong>. Reveja custos e preços antes de aumentar o volume.');
    if(!alertas.length) alertas.push('Não foram encontrados alertas críticos com os dados atuais. Continue a registar custos, pagamentos e produção para melhorar a leitura do negócio.');
    const prospeccao=(contactos||[]).slice(0,8).map(c=>'<div class="obra-card"><div class="obra-top"><div class="obra-cliente">Contacto '+esc(c.telefone||'sem telefone')+'</div><span class="estado-badge estado-por_concluir">'+esc(c.origem||'vitrine')+'</span></div><div class="obra-tipo">Registado em '+new Date(c.criado_em).toLocaleDateString('pt-PT')+' · próximo passo: contactar e identificar necessidade.</div></div>').join('');
    const prec=(precos||[]).map(p=>'<div class="obra-card"><div class="obra-top"><div class="obra-cliente">'+esc(p.nome_exibicao||p.tipo)+'</div><span class="mono">'+Number(p.margem_padrao_percent||0)+'% margem padrão</span></div><div class="obra-tipo">Materiais: '+formatAOA(Number(p.custo_materiais||0))+' · Produção: '+Number(p.horas_producao||0)+' h · Mínima: '+Number(p.margem_minima_percent||0)+'%</div></div>').join('');
    container.innerHTML='<div class="page-head"><h2>Mentor Dionuel</h2><p>Transforma os dados registados em sinais de gestão, prioridades e próximos passos.</p></div>'+
      '<div class="relatorio-kpis"><div class="kpi-card"><span class="kpi-label">Recebido no mês</span><span class="kpi-valor">'+formatAOA(receita)+'</span></div><div class="kpi-card"><span class="kpi-label">Faturado no mês</span><span class="kpi-valor">'+formatAOA(faturado)+'</span></div><div class="kpi-card"><span class="kpi-label">Custos diretos</span><span class="kpi-valor">'+formatAOA(custo)+'</span></div><div class="kpi-card"><span class="kpi-label">Despesas do mês</span><span class="kpi-valor">'+formatAOA(despesasMes)+'</span></div><div class="kpi-card"><span class="kpi-label">Resultado operacional</span><span class="kpi-valor">'+formatAOA(resultado)+'</span></div><div class="kpi-card"><span class="kpi-label">Margem bruta estimada</span><span class="kpi-valor">'+margem.toFixed(1)+'%</span></div></div>'+
      '<div class="form-card"><h3>Direção para hoje</h3>'+alertas.map((a,i)=>'<div class="obra-card"><div class="obra-cliente">'+(i+1)+'. '+a+'</div></div>').join('')+'</div>'+
      '<div class="form-card"><h3>Caixa e compromissos</h3><p style="color:var(--linho-dim);font-size:13px;line-height:1.7;">Custos fixos mensais: <strong>'+formatAOA(fixos)+'</strong>. Contas vencidas: <strong>'+vencidas+'</strong>. Encomendas pendentes: <strong>'+pendentes+'</strong>.</p></div>'+
      '<div class="form-card"><h3>Prospecção a trabalhar</h3>'+(prospeccao||'<div class="empty-state-small">Ainda não há contactos interessados registados.</div>')+'</div>'+
      '<div class="form-card"><h3>Base atual de precificação</h3><p style="color:var(--linho-dim);font-size:12.5px;margin-bottom:12px;">As regras já existentes passam a alimentar o futuro cálculo automático de preços.</p>'+(prec||'<div class="empty-state-small">Ainda não há regras de peças configuradas.</div>')+'</div>';
  }catch(e){container.innerHTML='<div class="error-banner">Não foi possível gerar o diagnóstico: '+esc(e.message||'erro desconhecido')+'</div>';}
}
