import { useState } from 'react';
import { useContract } from '../contexts/ContractContext';

export function InitializeContract() {
  const { inicializarContrato, loading, error, estaConectado } = useContract();
  
  const [formData, setFormData] = useState({
    comprador: '',
    vendedor: '',
    valorEmEther: '',
    chassi: '',
    placa: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await inicializarContrato(formData);
  };
  
  if (!estaConectado) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Inicializar Contrato
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comprador" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Endereço do Comprador
          </label>
          <input
            type="text"
            id="comprador"
            name="comprador"
            value={formData.comprador}
            onChange={handleChange}
            required
            placeholder="0x..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="vendedor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Endereço do Vendedor
          </label>
          <input
            type="text"
            id="vendedor"
            name="vendedor"
            value={formData.vendedor}
            onChange={handleChange}
            required
            placeholder="0x..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="valorEmEther" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Valor (ETH)
          </label>
          <input
            type="number"
            id="valorEmEther"
            name="valorEmEther"
            value={formData.valorEmEther}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="1.0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="chassi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Chassi do Veículo
          </label>
          <input
            type="text"
            id="chassi"
            name="chassi"
            value={formData.chassi}
            onChange={handleChange}
            required
            placeholder="9BWHE21JX24060831"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Placa do Veículo
          </label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            required
            placeholder="ABC1234"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/20 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                    text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500 transition-colors
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processando...' : 'Inicializar Contrato'}
        </button>
      </form>
    </div>
  );
}