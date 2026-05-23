const MOCK_TEMPLATES = [
  {
    id: '1',
    nome: 'Prestação de Serviços',
    conteudo: `**CONTRATO DE PRESTAÇÃO DE SERVIÇOS**\n\nEste contrato é celebrado entre as partes abaixo identificadas:\n\n**Contratante:** {{contratante}}\n**Documento:** {{documento}}\n**E-mail:** {{email}}\n\nO presente contrato tem por objeto a prestação de serviços profissionais conforme descrito abaixo:\n\n- Execução das atividades acordadas entre as partes\n- Prazo de entrega conforme cronograma estabelecido\n- Pagamento conforme condições negociadas\n\n**Endereço do contratante:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}\n\nAs partes concordam com os termos acima e assinam o presente instrumento.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nome: 'Locação Residencial',
    conteudo: `**CONTRATO DE LOCAÇÃO RESIDENCIAL**\n\n**Locatário:** {{contratante}}\n**Documento:** {{documento}}\n**E-mail:** {{email}}\n\nO imóvel objeto deste contrato está localizado conforme endereço fornecido pelo locatário para correspondência:\n\n**Endereço:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}\n\nCondições gerais da locação:\n\n- Prazo de locação conforme acordado entre as partes\n- Valor do aluguel a ser pago mensalmente até o vencimento\n- Imóvel deve ser devolvido nas mesmas condições de entrega\n- Proibida a sublocação sem autorização expressa do locador\n\nO descumprimento de qualquer cláusula ensejará rescisão imediata do contrato.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    nome: 'NDA',
    conteudo: `**ACORDO DE CONFIDENCIALIDADE (NDA)**\n\n**Parte Receptora:** {{contratante}}\n**Documento:** {{documento}}\n**E-mail:** {{email}}\n**Endereço:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}\n\nA parte receptora se compromete a manter em **sigilo absoluto** todas as informações confidenciais recebidas.\n\nObrigações da parte receptora:\n\n- Não divulgar informações a terceiros sem autorização prévia e por escrito\n- Utilizar as informações exclusivamente para os fins acordados\n- Notificar imediatamente em caso de divulgação não autorizada\n- Devolver ou destruir os materiais confidenciais quando solicitado\n\n**Vigência:** Este acordo permanece em vigor por 2 (dois) anos a partir da data de assinatura.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    nome: 'Compra e Venda',
    conteudo: `**CONTRATO DE COMPRA E VENDA**\n\n**Comprador:** {{contratante}}\n**Documento:** {{documento}}\n**E-mail:** {{email}}\n**Endereço para entrega:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}\n\nO presente contrato regula a compra e venda do bem descrito abaixo:\n\n- Descrição completa do bem objeto da transação\n- Preço total acordado entre as partes\n- Forma de pagamento: conforme negociado\n- Prazo de entrega: conforme acordado\n\nResponsabilidades do vendedor:\n\n- Entregar o bem nas condições descritas neste contrato\n- Garantir a procedência e regularidade do bem\n- Fornecer documentação necessária para transferência\n\nO comprador declara estar ciente das condições do bem adquirido.`,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export function getTemplates() {
  return new Promise(resolve =>
    setTimeout(() => resolve(MOCK_TEMPLATES.map(t => ({ ...t }))), 200)
  );
}

export function createTemplate(data) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ ...data, id: String(Date.now()), createdAt: new Date().toISOString() }), 300)
  );
}

export function updateTemplate(id, data) {
  const existing = MOCK_TEMPLATES.find(t => t.id === id);
  return new Promise(resolve =>
    setTimeout(() => resolve({ ...(existing || {}), ...data, id }), 300)
  );
}

export function deleteTemplate(id) {
  return new Promise(resolve => setTimeout(() => resolve(id), 200));
}
