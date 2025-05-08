import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { StatusVeiculo, Contrato } from '../constants/contractData';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ContratoDetalheProps {
  contrato: Contrato;
  contratoId: number;
  papel: 'comprador' | 'vendedor' | null;
  onVoltar: () => void;
  onAtualizacao: () => Promise<void>;
}

const ContratoDetalhe: React.FC<ContratoDetalheProps> = ({
  contrato,
  contratoId,
  papel,
  onVoltar,
  onAtualizacao
}) => {
  const { contract, account } = useWeb3();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const getStatusText = (status: StatusVeiculo) => {
    switch(status) {
      case StatusVeiculo.Pendente: return 'Pendente';
      case StatusVeiculo.Aceito: return 'Aceito';
      case StatusVeiculo.Rejeitado: return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };
  
  const getStatusColor = (status: StatusVeiculo) => {
    switch(status) {
      case StatusVeiculo.Pendente: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case StatusVeiculo.Aceito: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case StatusVeiculo.Rejeitado: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const depositarPagamento = async () => {
    if (!contract || papel !== 'comprador') return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const valorEmWei = ethers.utils.parseEther(contrato.valor);
      const tx = await contract.depositarPagamento(contratoId, { value: valorEmWei });
      await tx.wait();
      
      setSuccess("Pagamento depositado com sucesso!");
      await onAtualizacao();
    } catch (err: any) {
      console.error("Erro ao depositar pagamento:", err);
      setError(err.message || "Erro ao depositar pagamento");
    } finally {
      setIsLoading(false);
    }
  };
  
  const marcarTransferencia = async () => {
    if (!contract || papel !== 'vendedor') return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const tx = await contract.marcarTransferenciaVeiculo(contratoId);
      await tx.wait();
      
      setSuccess("Transferência do veículo marcada com sucesso!");
      await onAtualizacao();
    } catch (err: any) {
      console.error("Erro ao marcar transferência:", err);
      setError(err.message || "Erro ao marcar transferência");
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmarRecebimento = async () => {
    if (!contract || papel !== 'comprador') return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const tx = await contract.confirmarRecebimento(contratoId);
      await tx.wait();
      
      setSuccess("Recebimento confirmado com sucesso! O pagamento foi enviado ao vendedor.");
      await onAtualizacao();
    } catch (err: any) {
      console.error("Erro ao confirmar recebimento:", err);
      setError(err.message || "Erro ao confirmar recebimento");
    } finally {
      setIsLoading(false);
    }
  };
  
  const rejeitarVeiculo = async () => {
    if (!contract || papel !== 'comprador') return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const tx = await contract.rejeitarVeiculo(contratoId);
      await tx.wait();
      
      setSuccess("Veículo rejeitado com sucesso! O pagamento foi devolvido à sua carteira.");
      await onAtualizacao();
    } catch (err: any) {
      console.error("Erro ao rejeitar veículo:", err);
      setError(err.message || "Erro ao rejeitar veículo");
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const isOwner = papel === 'comprador' || papel === 'vendedor';
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onVoltar}
            className="p-0 h-8 w-8 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>Detalhes do Contrato #{contratoId}</CardTitle>
        </div>
        <div className={`text-xs px-3 py-1 rounded-full ${getStatusColor(contrato.status)}`}>
          {getStatusText(contrato.status)}
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
            {success}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-start">
              <ShieldCheck className="h-6 w-6 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Seu papel</h3>
                {isOwner ? (
                  <p className="text-blue-700 dark:text-blue-400">
                    Você é o <strong>{papel === 'comprador' ? 'Comprador' : 'Vendedor'}</strong> neste contrato
                  </p>
                ) : (
                  <p className="text-blue-700 dark:text-blue-400">
                    Você não está envolvido neste contrato
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Informações do Veículo</h3>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium">Placa: <span className="font-normal">{contrato.veiculo.placa}</span></p>
                <p className="text-sm font-medium">Chassi: <span className="font-normal">{contrato.veiculo.chassi}</span></p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor do Contrato</h3>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{contrato.valor} ETH</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Comprador</h3>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md break-all">
                <p className="text-sm font-medium">{contrato.comprador}</p>
                {papel === 'comprador' && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-300">
                    Você
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendedor</h3>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md break-all">
                <p className="text-sm font-medium">{contrato.vendedor}</p>
                {papel === 'vendedor' && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-300">
                    Você
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status do Contrato</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${contrato.pagamentoDepositado ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  {contrato.pagamentoDepositado && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Pagamento Depositado</p>
                  {!contrato.pagamentoDepositado && papel === 'comprador' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Você precisa depositar o pagamento</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${contrato.veiculoTransferido ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  {contrato.veiculoTransferido && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Veículo Transferido</p>
                  {!contrato.veiculoTransferido && contrato.pagamentoDepositado && papel === 'vendedor' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Você precisa marcar a transferência do veículo</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${contrato.transacaoFinalizada ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  {contrato.transacaoFinalizada && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Transação Finalizada</p>
                  {!contrato.transacaoFinalizada && contrato.veiculoTransferido && papel === 'comprador' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Você precisa confirmar ou rejeitar o recebimento</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-3 justify-center">
        {papel === 'comprador' && !contrato.pagamentoDepositado && !contrato.transacaoFinalizada && (
          <Button
            variant="primary"
            onClick={depositarPagamento}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Depositar Pagamento ({contrato.valor} ETH)
          </Button>
        )}
        
        {papel === 'vendedor' && contrato.pagamentoDepositado && !contrato.veiculoTransferido && !contrato.transacaoFinalizada && (
          <Button
            variant="primary"
            onClick={marcarTransferencia}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Marcar Transferência do Veículo
          </Button>
        )}
        
        {papel === 'comprador' && contrato.veiculoTransferido && !contrato.transacaoFinalizada && (
          <>
            <Button
              variant="success"
              onClick={confirmarRecebimento}
              isLoading={isLoading}
              disabled={isLoading}
              className="flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Confirmar Recebimento
            </Button>
            
            <Button
              variant="danger"
              onClick={rejeitarVeiculo}
              isLoading={isLoading}
              disabled={isLoading}
              className="flex items-center"
            >
              <XCircle className="w-4 h-4 mr-1" /> Rejeitar Veículo
            </Button>
          </>
        )}
        
        {contrato.transacaoFinalizada && (
          <div className="w-full text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Este contrato foi finalizado {contrato.status === StatusVeiculo.Aceito ? 'com sucesso' : 'com rejeição'}.
            </p>
            {contrato.status === StatusVeiculo.Aceito ? (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="w-4 h-4 inline mr-1" /> Transação Concluída
              </span>
            ) : (
              <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full dark:bg-red-900/30 dark:text-red-300">
                <XCircle className="w-4 h-4 inline mr-1" /> Transação Cancelada
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContratoDetalhe;