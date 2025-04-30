import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useContract } from '../contexts/ContractContext';
import { formatarEndereco, statusVeiculoParaTexto } from '../utils/formatters';

export function StatusCard() {
  const { 
    statusTransacao, 
    dadosContrato, 
    dadosVeiculo,
    estaConectado
  } = useContract();

  if (!estaConectado) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Status da Transação
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Conecte sua carteira para visualizar o status da transação.
        </p>
      </div>
    );
  }

  const StatusIcon = () => {
    switch (statusTransacao.status) {
      case 1: // Aceito
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 2: // Rejeitado
        return <XCircle className="h-8 w-8 text-red-500" />;
      default: // Pendente
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Status da Transação
        </h2>
        <StatusIcon />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span className={`font-medium ${
            statusTransacao.status === 0 ? 'text-yellow-500' :
            statusTransacao.status === 1 ? 'text-green-500' : 'text-red-500'
          }`}>
            {statusVeiculoParaTexto(statusTransacao.status)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Pagamento:</span>
          <span className={`font-medium ${
            statusTransacao.pagamentoDepositado ? 'text-green-500' : 'text-gray-500'
          }`}>
            {statusTransacao.pagamentoDepositado ? 'Depositado' : 'Pendente'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Veículo:</span>
          <span className={`font-medium ${
            statusTransacao.veiculoTransferido ? 'text-green-500' : 'text-gray-500'
          }`}>
            {statusTransacao.veiculoTransferido ? 'Transferido' : 'Pendente'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Finalizado:</span>
          <span className={`font-medium ${
            statusTransacao.transacaoFinalizada ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {statusTransacao.transacaoFinalizada ? 'Sim' : 'Não'}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-white mb-2">Detalhes do Veículo</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Chassi:</span>
              <p className="font-medium text-gray-800 dark:text-white">{dadosVeiculo.chassi || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Placa:</span>
              <p className="font-medium text-gray-800 dark:text-white">{dadosVeiculo.placa || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-white mb-2">Partes Envolvidas</h3>
          
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Comprador:</span>
            <p className="font-medium text-gray-800 dark:text-white">
              {dadosContrato.comprador ? formatarEndereco(dadosContrato.comprador) : 'Não definido'}
            </p>
          </div>
          
          <div className="mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Vendedor:</span>
            <p className="font-medium text-gray-800 dark:text-white">
              {dadosContrato.vendedor ? formatarEndereco(dadosContrato.vendedor) : 'Não definido'}
            </p>
          </div>
          
          <div className="mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Valor:</span>
            <p className="font-medium text-gray-800 dark:text-white">
              {dadosContrato.valor ? `${dadosContrato.valor} ETH` : '0 ETH'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}