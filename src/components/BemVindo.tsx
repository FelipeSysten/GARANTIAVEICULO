import { Car, Shield } from 'lucide-react';
import { useContract } from '../contexts/ContractContext';

export function BemVindo() {
  const { estaConectado } = useContract();

  // Se já está conectado, não exibe o componente de boas-vindas
  if (estaConectado) return null;

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center max-w-2xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
          <Car className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Bem-vindo ao Sistema de Garantia de Veículo
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Plataforma segura para compra e venda de veículos utilizando contratos inteligentes na blockchain Ethereum.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Para Compradores
          </h2>
          <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Depósito seguro em contrato inteligente
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Reembolso garantido em caso de rejeição
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Verificação da transferência do veículo
            </li>
          </ul>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Para Vendedores
          </h2>
          <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Garantia de pagamento antes da transferência
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Processo transparente e rastreável
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Recebimento automático após confirmação
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center text-left mb-6">
        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Este sistema utiliza a tecnologia blockchain para garantir que todas as transações 
          sejam seguras, imutáveis e totalmente rastreáveis.
        </p>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Para começar, conecte sua carteira MetaMask clicando no botão acima.
      </p>
    </div>
  );
}