import { useContract } from '../contexts/ContractContext';
import { CarFront } from 'lucide-react';

export function SellerActions() {
  const { 
    estaConectado, 
    eVendedor, 
    marcarTransferenciaVeiculo, 
    statusTransacao,
    loading,
    error
  } = useContract();

  // Se não estiver conectado ou não for o vendedor, não exibe nada
  if (!estaConectado || !eVendedor) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Ações do Vendedor
      </h2>

      {/* Ação de Marcar Transferência do Veículo */}
      {statusTransacao.pagamentoDepositado && !statusTransacao.veiculoTransferido && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O comprador já depositou o pagamento. Você pode agora marcar o veículo como transferido.
          </p>
          <button
            onClick={marcarTransferenciaVeiculo}
            disabled={loading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent 
                        rounded-md shadow-sm text-sm font-medium text-white 
                        bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <CarFront className="h-4 w-4 mr-2" />
            {loading ? 'Processando...' : 'Marcar Veículo como Transferido'}
          </button>
        </div>
      )}

      {/* Mensagens de status */}
      {!statusTransacao.pagamentoDepositado && (
        <p className="text-yellow-600 dark:text-yellow-400">
          Aguardando o comprador depositar o pagamento.
        </p>
      )}

      {statusTransacao.veiculoTransferido && !statusTransacao.transacaoFinalizada && (
        <p className="text-blue-600 dark:text-blue-400">
          Veículo marcado como transferido. Aguardando confirmação do comprador.
        </p>
      )}

      {statusTransacao.transacaoFinalizada && (
        <div>
          {statusTransacao.status === 1 ? (
            <p className="text-green-600 dark:text-green-400">
              Transação finalizada com sucesso! O comprador aceitou o veículo.
            </p>
          ) : (
            <p className="text-red-600 dark:text-red-400">
              O comprador rejeitou o veículo. O pagamento foi reembolsado.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}
    </div>
  );
}