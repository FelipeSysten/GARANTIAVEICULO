import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contractData';

interface Web3ContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  conectarCarteira: () => Promise<void>;
  trocarConta: () => Promise<void>;
  isConnected: boolean;
  chainId: number | null;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inicializa o contrato
  const initializeContract = useCallback(async (newProvider: ethers.providers.Web3Provider) => {
    try {
      const newSigner = newProvider.getSigner();
      setSigner(newSigner);
      
      const newContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        newSigner
      );
      setContract(newContract);
    } catch (err: any) {
      console.error("Erro ao inicializar contrato:", err);
      setError(`Erro ao inicializar contrato: ${err.message}`);
    }
  }, []);

  // Função para conectar carteira
  const conectarCarteira = async () => {
    setError(null);
    if (window.ethereum) {
      try {
        // Solicita contas ao MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        
        const network = await newProvider.getNetwork();
        setChainId(network.chainId);
        
        if (accounts[0]) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await initializeContract(newProvider);
        }
      } catch (err: any) {
        console.error("Erro ao conectar:", err);
        setError(`Erro ao conectar: ${err.message}`);
      }
    } else {
      setError("MetaMask não encontrado. Por favor, instale a extensão MetaMask.");
    }
  };

  // Função para trocar de conta
  const trocarConta = async () => {
    setError(null);
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts[0]) {
          setAccount(accounts[0]);
          
          if (provider) {
            await initializeContract(provider);
          }
        }
      } catch (err: any) {
        console.error("Erro ao trocar de conta:", err);
        setError(`Erro ao trocar de conta: ${err.message}`);
      }
    } else {
      setError("MetaMask não encontrado. Por favor, instale a extensão MetaMask.");
    }
  };

  // Ouvintes de eventos do Ethereum
  useEffect(() => {
    if (window.ethereum) {
      // Quando o usuário troca de conta
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setIsConnected(false);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      };

      // Quando o usuário troca de rede
      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
        window.location.reload(); // Recarregar a página conforme recomendado pela documentação do MetaMask
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Limpar ouvintes ao desmontar
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Verificar se já há uma conexão ao carregar a página
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);
            
            const network = await newProvider.getNetwork();
            setChainId(network.chainId);
            
            setAccount(accounts[0]);
            setIsConnected(true);
            
            await initializeContract(newProvider);
          }
        } catch (err) {
          console.error("Erro ao verificar conexão:", err);
        }
      }
    };
    
    checkConnection();
  }, [initializeContract]);

  return (
    <Web3Context.Provider value={{
      account,
      provider,
      signer,
      contract,
      conectarCarteira,
      trocarConta,
      isConnected,
      chainId,
      error
    }}>
      {children}
    </Web3Context.Provider>
  );
};

// Hook personalizado para usar o contexto Web3
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 deve ser usado dentro de um Web3Provider');
  }
  return context;
};

// Declaração para TypeScript reconhecer ethereum na window
declare global {
  interface Window {
    ethereum: any;
  }
}