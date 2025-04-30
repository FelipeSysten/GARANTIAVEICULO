import { useState } from 'react';
import { useContract } from '../contexts/ContractContext';
import { CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

export function BuyerActions() {
  const { 
    estaConectado, 
    eComprador, 
    depositarPagamento, 
    confirmarRecebimento, 
    rejeitarVeiculo, 
    reembolsoAutomatico,
    statusTransacao,
    dadosContrato,
    loading,
    error
  } = useContract();

  const [valorDeposito, setValorDeposito] = useState(dadosContrato.valor);

  const handleDepositar = async (e: React.FormEvent) => {
    e.preventDefault();
    await depositarPagamento(valorDeposito);
  };

  // Se não estiver conectado ou não for o comprador, não exibe nada
  if (!estaConectado || !eComprador) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Ações do Comprador
      </h2>

      {/* Ação de Depositar Pagamento */}
      {!statusTransacao.pagamentoDepositado && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Depositar Pagamento
          </h3>
          <form onSubmit={handleDepositar} className="space-y-3">
            <div>
              <label htmlFor="valorDeposito" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor em ETH
              </label>
              <input
                type="number"
                id="valorDeposito"
                value={valorDeposito}
                onChange={(e) => setValorDeposito(e.target.value)}
                step="0.01"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-2 px-4 border border-transparent 
                          rounded-md shadow-sm text-sm font-medium text-white 
                          bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors
                          ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processando...' : 'Depositar Pagamento'}
            </button>
          </form>
        </div>
      )}

      {/* Ações disponíveis quando o veículo foi transferido */}
      {statusTransacao.veiculoTransferido && !statusTransacao.transacaoFinalizada && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
              Responder à Transferência
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={confirmarRecebimento}
              disabled={loading}
              className={`flex items-center justify-center py-2 px-4 border border-transparent 
                          rounded-md shadow-sm text-sm font-medium text-white 
                          bg-green-600 hover:bg-green-700 focus:outline-none transition-colors
                          ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Recebimento
            </button>
            
            <button
              onClick={rejeitarVeiculo}
              disabled={loading}
              className={`flex items-center justify-center py-2 px-4 border border-transparent 
                          rounded-md shadow-sm text-sm font-medium text-white 
                          bg-red-600 hover:bg-red-700 focus:outline-none transition-colors
                          ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar Veículo
            </button>
          </div>
        </div>
      )}

      {/* Ação de Reembolso Automático */}
      {statusTransacao.veiculoTransferido && !statusTransacao.transacaoFinalizada && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reembolso Automático
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Se o limite de tempo de resposta (5 dias) passou, você pode solicitar o reembolso automático.
          </p>
          <button
            onClick={reembolsoAutomatico}
            disabled={loading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent 
                        rounded-md shadow-sm text-sm font-medium text-white 
                        bg-yellow-600 hover:bg-yellow-700 focus:outline-none transition-colors
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Solicitar Reembolso Automático
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}

      {/* Mensagem quando não há ações disponíveis */}
      {statusTransacao.transacaoFinalizada && (
        <p className="text-gray-600 dark:text-gray-400">
          A transação foi finalizada. Nenhuma ação adicional é necessária.
        </p>
      )}
      
      {statusTransacao.pagamentoDepositado && !statusTransacao.veiculoTransferido && (
        <p className="text-gray-600 dark:text-gray-400">
          Aguardando o vendedor marcar o veículo como transferido.
        </p>
      )}
    </div>
  );
}