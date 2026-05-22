const TEMPLATES = {
  'Prestação de Serviços': `**CONTRATO DE PRESTAÇÃO DE SERVIÇOS**

Este contrato é celebrado entre as partes abaixo identificadas:

**Contratante:** {{contratante}}
**Documento:** {{documento}}
**E-mail:** {{email}}

O presente contrato tem por objeto a prestação de serviços profissionais conforme descrito abaixo:

- Execução das atividades acordadas entre as partes
- Prazo de entrega conforme cronograma estabelecido
- Pagamento conforme condições negociadas

**Endereço do contratante:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}

As partes concordam com os termos acima e assinam o presente instrumento.`,

  'Locação Residencial': `**CONTRATO DE LOCAÇÃO RESIDENCIAL**

**Locatário:** {{contratante}}
**Documento:** {{documento}}
**E-mail:** {{email}}

O imóvel objeto deste contrato está localizado conforme endereço fornecido pelo locatário para correspondência:

**Endereço:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}

Condições gerais da locação:

- Prazo de locação conforme acordado entre as partes
- Valor do aluguel a ser pago mensalmente até o vencimento
- Imóvel deve ser devolvido nas mesmas condições de entrega
- Proibida a sublocação sem autorização expressa do locador

O descumprimento de qualquer cláusula ensejará rescisão imediata do contrato.`,

  'NDA': `**ACORDO DE CONFIDENCIALIDADE (NDA)**

**Parte Receptora:** {{contratante}}
**Documento:** {{documento}}
**E-mail:** {{email}}
**Endereço:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}

A parte receptora se compromete a manter em **sigilo absoluto** todas as informações confidenciais recebidas.

Obrigações da parte receptora:

- Não divulgar informações a terceiros sem autorização prévia e por escrito
- Utilizar as informações exclusivamente para os fins acordados
- Notificar imediatamente em caso de divulgação não autorizada
- Devolver ou destruir os materiais confidenciais quando solicitado

**Vigência:** Este acordo permanece em vigor por 2 (dois) anos a partir da data de assinatura.`,

  'Compra e Venda': `**CONTRATO DE COMPRA E VENDA**

**Comprador:** {{contratante}}
**Documento:** {{documento}}
**E-mail:** {{email}}
**Endereço para entrega:** {{endereco}}, {{numero}} - {{bairro}}, {{cidade}}/{{uf}}

O presente contrato regula a compra e venda do bem descrito abaixo:

- Descrição completa do bem objeto da transação
- Preço total acordado entre as partes
- Forma de pagamento: conforme negociado
- Prazo de entrega: conforme acordado

Responsabilidades do vendedor:

- Entregar o bem nas condições descritas neste contrato
- Garantir a procedência e regularidade do bem
- Fornecer documentação necessária para transferência

O comprador declara estar ciente das condições do bem adquirido.`
};

const MOCK_CONTRACTS = [
  { id: '1',  modelo: 'Prestação de Serviços', contratante: 'Ana',       tipoDocumento: 'CPF',  documento: '111.222.333-44', email: 'ana@email.com',      cep: '01310-100', endereco: 'Av. Paulista',          numero: '1000', bairro: 'Bela Vista',    cidade: 'São Paulo',       uf: 'SP', status: 'assinado',              createdAt: '2024-01-15T10:00:00Z' },
  { id: '2',  modelo: 'Locação Residencial',   contratante: 'Bruno',            tipoDocumento: 'CPF',  documento: '222.333.444-55', email: 'bruno@email.com',      cep: '20040-020', endereco: 'Rua da Assembleia',     numero: '35',   bairro: 'Centro',        cidade: 'Rio de Janeiro',  uf: 'RJ', status: 'aguardando_assinatura', createdAt: '2024-02-03T09:30:00Z' },
  { id: '3',  modelo: 'NDA',                   contratante: 'Carlos',         tipoDocumento: 'CNPJ', documento: '12.345.678/0001-90', email: 'carlos@empresa.com',     cep: '30130-110', endereco: 'Av. Afonso Pena',       numero: '500',  bairro: 'Centro',        cidade: 'Belo Horizonte',  uf: 'MG', status: 'nao_enviado',           createdAt: '2024-02-20T14:00:00Z' },
  { id: '4',  modelo: 'Compra e Venda',        contratante: 'Daniela',      tipoDocumento: 'CPF',  documento: '333.444.555-66', email: 'dani.f@email.com',          cep: '80010-020', endereco: 'Rua XV de Novembro',    numero: '1200', bairro: 'Centro',        cidade: 'Curitiba',        uf: 'PR', status: 'cancelado',             createdAt: '2024-03-01T11:00:00Z' },
];

let failNextLoad = new URLSearchParams(location.search).has('simulateError');

export function getContracts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failNextLoad) {
        failNextLoad = false;
        reject(new Error('Erro ao carregar contratos.'));
        return;
      }
      resolve(MOCK_CONTRACTS.map(c => ({ ...c })));
    }, 300);
  });
}

export function createContract(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (String(data.documento).replace(/\D/g, '') === '00000000000') {
        reject(new Error('Não foi possível salvar o contrato. Tente novamente.'));
        return;
      }
      const newContract = {
        ...data,
        id: String(Date.now()),
        status: 'nao_enviado',
        createdAt: new Date().toISOString(),
      };
      resolve(newContract);
    }, 500);
  });
}

export function updateContract(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...data, id }), 500);
  });
}

export function deleteContract(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(id), 400);
  });
}

export { TEMPLATES };
