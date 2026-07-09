const MOCK_ACTIVITIES = [
  { id: '1', usuario: 'Ana Lima',       acao: 'criou o contrato',     alvo: 'Prestação de Serviços - Ana Lima',     data: '2024-08-12T09:15:00Z' },
  { id: '2', usuario: 'Admin Geral',    acao: 'criou o usuário',      alvo: 'Camila Duarte',                        data: '2024-08-11T16:40:00Z' },
  { id: '3', usuario: 'Bruno Mendes',   acao: 'atualizou o contrato', alvo: 'Locação Residencial - Bruno Mendes',   data: '2024-08-10T11:05:00Z' },
  { id: '4', usuario: 'Admin Geral',    acao: 'excluiu o template',   alvo: 'Rascunho antigo',                      data: '2024-08-09T14:20:00Z' },
  { id: '5', usuario: 'Camila Duarte',  acao: 'assinou o contrato',   alvo: 'NDA - Carlos Tech Ltda',               data: '2024-08-08T10:00:00Z' },
  { id: '6', usuario: 'Usuário Padrão', acao: 'criou o template',     alvo: 'Contrato de Parceria',                 data: '2024-08-07T08:30:00Z' },
];

export function getActivities() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ACTIVITIES.map(a => ({ ...a }))), 300);
  });
}
