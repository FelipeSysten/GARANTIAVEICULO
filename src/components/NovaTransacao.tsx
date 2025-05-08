import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import Button from './ui/Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';

const NovaTransacao: React.FC = () => {
  const { contract, account, isConnected } = useWeb3();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    comprador: '',
    vendedor: '',
    valor: '',
    chassi: '',
    placa: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !contract) {
      setError("Conecte sua carteira para continuar.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validação de entrada
      if (!ethers.utils.isAddress(formData.comprador)) {
        throw new Error("Endereço do comprador inválido");
      }
      
      if (!ethers.utils.isAddress(formData.vendedor)) {
        throw new Error("Endereço do vendedor inválido");
      }
      
      if (!formData.valor || isNaN(parseFloat(formData.valor)) || parseFloat(formData.valor) <= 0) {
        throw new Error("Valor inválido");
      }
      
      if (!formData.chassi) {
        throw new Error("Número do chassi é obrigatório");
      }
      
      if (!formData.placa) {
        throw new Error("Placa do veículo é obrigatória");
      }
      
      // Chamar função do contrato inteligente
      const tx = await contract.inicializarContrato(
        formData.comprador,
        formData.vendedor,
        ethers.utils.parseEther(formData.valor),
        formData.chassi,
        formData.placa
      );
      
      // Aguardar confirmação da transação
      await tx.wait();
      
      setSuccess("Contrato inicializado com sucesso!");
      
      // Limpar formulário
      setFormData({
        comprador: '',
        vendedor: '',
        valor: '',
        chassi: '',
        placa: ''
      });
    } catch (err: any) {
      console.error("Erro ao inicializar contrato:", err);
      setError(err.message || "Erro ao inicializar contrato");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Contrato de Veículo</CardTitle>
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
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="comprador" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endereço do Comprador
              </label>
              <input
                type="text"
                id="comprador"
                name="comprador"
                value={formData.comprador}
                onChange={handleChange}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Endereço Ethereum do comprador
              </p>
            </div>
            
            <div>
              <label htmlFor="vendedor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endereço do Vendedor
              </label>
              <input
                type="text"
                id="vendedor"
                name="vendedor"
                value={formData.vendedor}
                onChange={handleChange}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor (ETH)
              </label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                min="0.000000000000000001"
                step="0.000000000000000001"
                placeholder="0.000000000000000001"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Valor mínimo: 0.000000000000000001 ETH (Rede Sepolia)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chassi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número do Chassi
                </label>
                <input
                  type="text"
                  id="chassi"
                  name="chassi"
                  value={formData.chassi}
                  onChange={handleChange}
                  placeholder="9BWHE21JX24060960"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="placa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Placa do Veículo
                </label>
                <input
                  type="text"
                  id="placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
                  placeholder="ABC1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>
          
          <CardFooter className="mt-6 px-0 py-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!isConnected || isLoading}
              className="w-full"
            >
              Inicializar Contrato
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default NovaTransacao;