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
  { id: '1',  modelo: 'Prestação de Serviços', contratante: 'Ana Lima',            tipoDocumento: 'CPF',  documento: '111.222.333-44',    email: 'ana@email.com',         cep: '01310-100', endereco: 'Av. Paulista',           numero: '1000', bairro: 'Bela Vista',    cidade: 'São Paulo',       uf: 'SP', status: 'assinado',              createdAt: '2024-01-15T10:00:00Z' },
  { id: '2',  modelo: 'Locação Residencial',   contratante: 'Bruno Mendes',        tipoDocumento: 'CPF',  documento: '222.333.444-55',    email: 'bruno@email.com',       cep: '20040-020', endereco: 'Rua da Assembleia',      numero: '35',   bairro: 'Centro',        cidade: 'Rio de Janeiro',  uf: 'RJ', status: 'aguardando_assinatura', createdAt: '2024-02-03T09:30:00Z' },
  { id: '3',  modelo: 'NDA',                   contratante: 'Carlos Tech Ltda',    tipoDocumento: 'CNPJ', documento: '12.345.678/0001-90', email: 'carlos@empresa.com',    cep: '30130-110', endereco: 'Av. Afonso Pena',        numero: '500',  bairro: 'Centro',        cidade: 'Belo Horizonte',  uf: 'MG', status: 'nao_enviado',           createdAt: '2024-02-20T14:00:00Z' },
  { id: '4',  modelo: 'Compra e Venda',        contratante: 'Daniela Faria',       tipoDocumento: 'CPF',  documento: '333.444.555-66',    email: 'dani@email.com',        cep: '80010-020', endereco: 'Rua XV de Novembro',     numero: '1200', bairro: 'Centro',        cidade: 'Curitiba',        uf: 'PR', status: 'cancelado',             createdAt: '2024-03-01T11:00:00Z' },
  { id: '5',  modelo: 'Prestação de Serviços', contratante: 'Eduardo Santos',      tipoDocumento: 'CPF',  documento: '444.555.666-77',    email: 'edu@email.com',         cep: '40020-010', endereco: 'Rua Chile',              numero: '22',   bairro: 'Comércio',      cidade: 'Salvador',        uf: 'BA', status: 'assinado',              createdAt: '2024-03-10T08:00:00Z' },
  { id: '6',  modelo: 'NDA',                   contratante: 'Fernanda Rocha',      tipoDocumento: 'CPF',  documento: '555.666.777-88',    email: 'fernanda@email.com',    cep: '60135-110', endereco: 'Av. Beira Mar',          numero: '3800', bairro: 'Meireles',      cidade: 'Fortaleza',       uf: 'CE', status: 'aguardando_assinatura', createdAt: '2024-03-15T13:00:00Z' },
  { id: '7',  modelo: 'Locação Residencial',   contratante: 'Gabriel Oliveira',    tipoDocumento: 'CPF',  documento: '666.777.888-99',    email: 'gabriel@email.com',     cep: '74015-010', endereco: 'Av. Goiás',             numero: '800',  bairro: 'Setor Central', cidade: 'Goiânia',         uf: 'GO', status: 'assinado',              createdAt: '2024-03-22T10:30:00Z' },
  { id: '8',  modelo: 'Compra e Venda',        contratante: 'Helena Costa',        tipoDocumento: 'CPF',  documento: '777.888.999-00',    email: 'helena@email.com',      cep: '69010-010', endereco: 'Av. Eduardo Ribeiro',    numero: '650',  bairro: 'Centro',        cidade: 'Manaus',          uf: 'AM', status: 'nao_enviado',           createdAt: '2024-04-01T09:00:00Z' },
  { id: '9',  modelo: 'Prestação de Serviços', contratante: 'Igor Matos',          tipoDocumento: 'CNPJ', documento: '98.765.432/0001-10', email: 'igor@startup.com',      cep: '51020-000', endereco: 'Av. Boa Viagem',         numero: '1200', bairro: 'Boa Viagem',    cidade: 'Recife',          uf: 'PE', status: 'cancelado',             createdAt: '2024-04-08T14:00:00Z' },
  { id: '10', modelo: 'NDA',                   contratante: 'Julia Neves',         tipoDocumento: 'CPF',  documento: '888.999.000-11',    email: 'julia@email.com',       cep: '88010-001', endereco: 'Rua Felipe Schmidt',     numero: '200',  bairro: 'Centro',        cidade: 'Florianópolis',   uf: 'SC', status: 'assinado',              createdAt: '2024-04-15T11:00:00Z' },
  { id: '11', modelo: 'Locação Residencial',   contratante: 'Kleber Souza',        tipoDocumento: 'CPF',  documento: '001.002.003-04',    email: 'kleber@email.com',      cep: '64000-040', endereco: 'Rua Álvaro Mendes',      numero: '14',   bairro: 'Centro',        cidade: 'Teresina',        uf: 'PI', status: 'aguardando_assinatura', createdAt: '2024-04-20T10:00:00Z' },
  { id: '12', modelo: 'Compra e Venda',        contratante: 'Luana Ferreira',      tipoDocumento: 'CPF',  documento: '002.003.004-05',    email: 'luana@email.com',       cep: '65010-200', endereco: 'Av. Getúlio Vargas',     numero: '350',  bairro: 'Centro',        cidade: 'São Luís',        uf: 'MA', status: 'assinado',              createdAt: '2024-05-01T09:30:00Z' },
  { id: '13', modelo: 'Prestação de Serviços', contratante: 'Marcos Vinicius',     tipoDocumento: 'CNPJ', documento: '23.456.789/0001-20', email: 'marcos@agencia.com',    cep: '58010-000', endereco: 'Rua Duque de Caxias',    numero: '77',   bairro: 'Centro',        cidade: 'João Pessoa',     uf: 'PB', status: 'nao_enviado',           createdAt: '2024-05-05T15:00:00Z' },
  { id: '14', modelo: 'NDA',                   contratante: 'Natalia Pires',       tipoDocumento: 'CPF',  documento: '003.004.005-06',    email: 'natalia@email.com',     cep: '78010-300', endereco: 'Av. Historiador Rubens',  numero: '100',  bairro: 'Porto',         cidade: 'Cuiabá',          uf: 'MT', status: 'aguardando_assinatura', createdAt: '2024-05-12T10:00:00Z' },
  { id: '15', modelo: 'Locação Residencial',   contratante: 'Otávio Almeida',      tipoDocumento: 'CPF',  documento: '004.005.006-07',    email: 'otavio@email.com',      cep: '49010-100', endereco: 'Rua João Pessoa',        numero: '400',  bairro: 'Centro',        cidade: 'Aracaju',         uf: 'SE', status: 'cancelado',             createdAt: '2024-05-18T14:00:00Z' },
  { id: '16', modelo: 'Compra e Venda',        contratante: 'Patricia Gomes',      tipoDocumento: 'CPF',  documento: '005.006.007-08',    email: 'patricia@email.com',    cep: '76801-000', endereco: 'Av. Presidente Dutra',   numero: '5656', bairro: 'Centro',        cidade: 'Porto Velho',     uf: 'RO', status: 'assinado',              createdAt: '2024-06-01T09:00:00Z' },
  { id: '17', modelo: 'Prestação de Serviços', contratante: 'Rafael Cardoso',      tipoDocumento: 'CNPJ', documento: '34.567.890/0001-30', email: 'rafael@consultoria.com',cep: '68900-000', endereco: 'Rua Cândido Mendes',     numero: '50',   bairro: 'Centro',        cidade: 'Macapá',          uf: 'AP', status: 'aguardando_assinatura', createdAt: '2024-06-08T11:00:00Z' },
  { id: '18', modelo: 'NDA',                   contratante: 'Sabrina Lemos',       tipoDocumento: 'CPF',  documento: '006.007.008-09',    email: 'sabrina@email.com',     cep: '69900-010', endereco: 'Av. Getúlio Vargas',     numero: '250',  bairro: 'Centro',        cidade: 'Rio Branco',      uf: 'AC', status: 'nao_enviado',           createdAt: '2024-06-15T13:00:00Z' },
  { id: '19', modelo: 'Locação Residencial',   contratante: 'Thiago Barbosa',      tipoDocumento: 'CPF',  documento: '007.008.009-10',    email: 'thiago@email.com',      cep: '69301-000', endereco: 'Av. Brigadeiro Eduardo', numero: '900',  bairro: 'Centro',        cidade: 'Boa Vista',       uf: 'RR', status: 'assinado',              createdAt: '2024-06-22T10:00:00Z' },
  { id: '20', modelo: 'Compra e Venda',        contratante: 'Ursula Monteiro',     tipoDocumento: 'CPF',  documento: '008.009.010-11',    email: 'ursula@email.com',      cep: '77001-002', endereco: 'Quadra 103 Sul',         numero: '15',   bairro: 'Plano Diretor',  cidade: 'Palmas',          uf: 'TO', status: 'cancelado',             createdAt: '2024-07-01T09:00:00Z' },
  { id: '21', modelo: 'Prestação de Serviços', contratante: 'Vitor Nascimento',    tipoDocumento: 'CNPJ', documento: '45.678.901/0001-40', email: 'vitor@empresa.com',     cep: '29010-150', endereco: 'Av. Jerônimo Monteiro',  numero: '1000', bairro: 'Centro',        cidade: 'Vitória',         uf: 'ES', status: 'assinado',              createdAt: '2024-07-10T11:00:00Z' },
  { id: '22', modelo: 'NDA',                   contratante: 'Wanda Teixeira',      tipoDocumento: 'CPF',  documento: '009.010.011-12',    email: 'wanda@email.com',       cep: '57020-080', endereco: 'Rua do Comércio',        numero: '88',   bairro: 'Centro',        cidade: 'Maceió',          uf: 'AL', status: 'aguardando_assinatura', createdAt: '2024-07-18T14:00:00Z' },
  { id: '23', modelo: 'Locação Residencial',   contratante: 'Xavier Braga',        tipoDocumento: 'CPF',  documento: '010.011.012-13',    email: 'xavier@email.com',      cep: '69065-000', endereco: 'Av. Djalma Batista',     numero: '1100', bairro: 'Chapada',       cidade: 'Manaus',          uf: 'AM', status: 'nao_enviado',           createdAt: '2024-07-25T10:00:00Z' },
  { id: '24', modelo: 'Compra e Venda',        contratante: 'Yasmin Cavalcante',   tipoDocumento: 'CPF',  documento: '011.012.013-14',    email: 'yasmin@email.com',      cep: '72110-001', endereco: 'SHN Quadra 2 Bloco F',   numero: '200',  bairro: 'Asa Norte',     cidade: 'Brasília',        uf: 'DF', status: 'assinado',              createdAt: '2024-08-01T09:00:00Z' },
  { id: '25', modelo: 'Prestação de Serviços', contratante: 'Zélia Fonseca',       tipoDocumento: 'CPF',  documento: '012.013.014-15',    email: 'zelia@email.com',       cep: '66010-000', endereco: 'Av. Nazaré',            numero: '370',  bairro: 'Nazaré',        cidade: 'Belém',           uf: 'PA', status: 'cancelado',             createdAt: '2024-08-10T13:00:00Z' },
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
