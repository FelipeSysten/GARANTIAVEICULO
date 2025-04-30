import { Moon, Sun, Wallet } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useContract } from '../contexts/ContractContext';
import { formatarEndereco } from '../utils/formatters';

export function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { 
    estaConectado, 
    conectarCarteira, 
    desconectarCarteira, 
    endereco,
    loading
  } = useContract();

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Garantia Veículo
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {estaConectado ? (
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
              {formatarEndereco(endereco)}
            </span>
            <button
              onClick={desconectarCarteira}
              className="py-2 px-4 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <button
            onClick={conectarCarteira}
            disabled={loading}
            className={`
              py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
              transition-colors flex items-center
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Conectando...
              </>
            ) : (
              <>Conectar Carteira</>
            )}
          </button>
        )}
      </div>
    </header>
  );
}