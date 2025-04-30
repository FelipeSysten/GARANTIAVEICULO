/**
 * Formata um endereço Ethereum para exibição simplificada
 * @param endereco Endereço completo da carteira Ethereum
 * @returns Endereço formatado (ex: 0x1234...5678)
 */
export function formatarEndereco(endereco: string): string {
  if (!endereco) return '';
  return `${endereco.substring(0, 6)}...${endereco.substring(endereco.length - 4)}`;
}

/**
 * Formata um timestamp para data e hora legíveis
 * @param timestamp Timestamp em segundos
 * @returns Data formatada em pt-BR
 */
export function formatarData(timestamp: number): string {
  if (!timestamp) return 'N/A';
  
  const data = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
}

/**
 * Converte o status numérico do veículo para texto
 * @param status Número do status (0: Pendente, 1: Aceito, 2: Rejeitado)
 * @returns Texto do status
 */
export function statusVeiculoParaTexto(status: number): string {
  switch (status) {
    case 0:
      return 'Pendente';
    case 1:
      return 'Aceito';
    case 2:
      return 'Rejeitado';
    default:
      return 'Desconhecido';
  }
}

/**
 * Trunca um texto longo
 * @param texto Texto a ser truncado
 * @param tamanho Tamanho máximo do texto (padrão: 15)
 * @returns Texto truncado com reticências
 */
export function truncarTexto(texto: string, tamanho: number = 15): string {
  if (!texto) return '';
  if (texto.length <= tamanho) return texto;
  return texto.substring(0, tamanho) + '...';
}