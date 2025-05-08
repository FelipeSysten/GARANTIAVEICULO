import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { StatusVeiculo, Contrato } from '../constants/contractData';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import ContratoDetalhe from './ContratoDetalhe';

const ListaContratos: React.FC = () => {
  const { contract, account, isConnected } = useWeb3();
  
  const [contratos, setContratos] = useState<Map<number, Contrato>>(new Map());
  const [contadorContratos, setContadorContratos] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contratoSelecionado, setContratoSelecionado] = useState<number | null>(null);
  
  const loadContratos = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obter contador de contratos
      const contador = await contract.contadorContratos();
      setContadorContratos(parseInt(contador.toString()));
      
      // Criar um novo Map para armazenar os contratos
      const novosContratos = new Map<number, Contrato>();
      
      // Carregar detalhes de cada contrato
      for (let i = 1; i <= contador; i++) {
        try {
          const contratoData = await contract.contratos(i);
          
          // Formatar dados do contrato
          const contrato: Contrato = {
            comprador: contratoData.comprador,
            vendedor: contratoData.vendedor,
            valor: ethers.utils.formatEther(contratoData.valor),
            pagamentoDepositado: contratoData.pagamentoDepositado,
            veiculoTransferido: contratoData.veiculoTransferido,
            transacaoFinalizada: contratoData.transacaoFinalizada,
            tempoTransferencia: parseInt(contratoData.tempoTransferencia.toString()),
            status: contratoData.status,
            veiculo: {
              chassi: '',
              placa: ''
            }
          };
          
          // Obter dados do veículo
          try {
            const [chassi, placa] = await contract.dadosVeiculo(i);
            contrato.veiculo = { chassi, placa };
          } catch (err) {
            console.error(`Erro ao obter dados do veículo do contrato ${i}:`, err);
          }
          
          novosContratos.set(i, contrato);
        } catch (err) {
          console.error(`Erro ao carregar contrato ${i}:`, err);
        }
      }
      
      setContratos(novosContratos);
    } catch (err: any) {
      console.error("Erro ao carregar contratos:", err);
      setError(`Erro ao carregar contratos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar contratos quando o componente montar ou quando o contrato/conta mudar
  useEffect(() => {
    if (contract && isConnected) {
      loadContratos();
    }
  }, [contract, account, isConnected]);

  // Filtrar contratos relacionados à conta atual (como comprador ou vendedor)
  const meusContratos = Array.from(contratos.entries())
    .filter(([_, contrato]) => {
      if (!account) return false;
      return contrato.comprador.toLowerCase() === account.toLowerCase() || 
             contrato.vendedor.toLowerCase() === account.toLowerCase();
    });

  const meuPapel = (contrato: Contrato): 'comprador' | 'vendedor' | null => {
    if (!account) return null;
    if (contrato.comprador.toLowerCase() === account.toLowerCase()) return 'comprador';
    if (contrato.vendedor.toLowerCase() === account.toLowerCase()) return 'vendedor';
    return null;
  };

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

  if (contratoSelecionado !== null) {
    const contrato = contratos.get(contratoSelecionado);
    if (contrato) {
      return (
        <ContratoDetalhe 
          contrato={contrato} 
          contratoId={contratoSelecionado}
          papel={meuPapel(contrato)}
          onVoltar={() => setContratoSelecionado(null)}
          onAtualizacao={loadContratos}
        />
      );
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Meus Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              {meusContratos.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Você ainda não tem contratos.</p>
                  <p className="mt-2">Crie um novo contrato para começar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meusContratos.map(([id, contrato]) => (
                    <div 
                      key={id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => setContratoSelecionado(id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Veículo: {contrato.veiculo.placa}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chassi: {contrato.veiculo.chassi}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Valor: {contrato.valor} ETH
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">
                              Você é o {meuPapel(contrato) === 'comprador' ? 'Comprador' : 'Vendedor'}
                            </span>
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contrato.status)}`}>
                            {getStatusText(contrato.status)}
                          </span>
                          
                          {contrato.transacaoFinalizada ? (
                            <span className="text-xs mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                              Finalizado
                            </span>
                          ) : (
                            <span className="text-xs mt-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300">
                              Em Andamento
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContratoSelecionado(id);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={loadContratos}
                  variant="outline"
                >
                  Atualizar Contratos
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaContratos;