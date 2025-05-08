import React from 'react';
import { Sun, Moon, Wallet, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useWeb3 } from '../contexts/Web3Context';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { account, conectarCarteira, trocarConta, isConnected } = useWeb3();

  // Formata o endereço da carteira para exibição (primeiros 6 e últimos 4 caracteres)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Garantia de Veículos
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {formatAddress(account as string)}
              </span>
              <Button 
                onClick={trocarConta}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Trocar Conta
              </Button>
            </div>
          ) : (
            <Button 
              onClick={conectarCarteira}
              variant="primary"
              size="default"
              className="flex items-center"
            >
              <Wallet className="w-4 h-4 mr-1" />
              Conectar Carteira
            </Button>
          )}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;