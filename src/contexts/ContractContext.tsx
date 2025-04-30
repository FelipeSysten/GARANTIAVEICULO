import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import { contratoABI } from '../utils/contratoABI';
import { formatarEndereco } from '../utils/formatters';

interface ContractContextType {
  provider: BrowserProvider | null;
  signer: any;
  contract: Contract | null;
  endereco: string;
  conectarCarteira: () => Promise<void>;
  desconectarCarteira: () => void;
  estaConectado: boolean;
  eComprador: boolean;
  eVendedor: boolean;
  statusTransacao: {
    status: number;
    pagamentoDepositado: boolean;
    veiculoTransferido: boolean;
    transacaoFinalizada: boolean;
  };
  atualizarStatus: () => Promise<void>;
  dadosVeiculo: {
    chassi: string;
    placa: string;
  };
  dadosContrato: {
    comprador: string;
    vendedor: string;
    valor: string;
  };
  inicializarContrato: (dados: {
    comprador: string;
    vendedor: string;
    valorEmEther: string;
    chassi: string;
    placa: string;
  }) => Promise<void>;
  depositarPagamento: (valor: string) => Promise<void>;
  marcarTransferenciaVeiculo: () => Promise<void>;
  confirmarRecebimento: () => Promise<void>;
  rejeitarVeiculo: () => Promise<void>;
  reembolsoAutomatico: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// Endereço do contrato implantado
const CONTRATO_ENDERECO = '0x0000000000000000000000000000000000000000'; // Substitua pelo endereço real

// Configuração da rede Sepolia
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Chain ID da rede Sepolia
const SEPOLIA_NETWORK = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SEP',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};

export function ContractProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [endereco, setEndereco] = useState<string>('');
  const [estaConectado, setEstaConectado] = useState<boolean>(false);
  const [eComprador, setEComprador] = useState<boolean>(false);
  const [eVendedor, setEVendedor] = useState<boolean>(false);
  const [statusTransacao, setStatusTransacao] = useState({
    status: 0,
    pagamentoDepositado: false,
    veiculoTransferido: false,
    transacaoFinalizada: false
  });
  const [dadosVeiculo, setDadosVeiculo] = useState({ chassi: '', placa: '' });
  const [dadosContrato, setDadosContrato] = useState({
    comprador: '',
    vendedor: '',
    valor: '0'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function conectarCarteira() {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === 'undefined' || !window.ethereum) {
        const errorMessage = 'MetaMask não encontrado! Por favor, instale a extensão MetaMask para continuar:\n' +
                           'https://metamask.io/download/';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Verifica se está na rede Sepolia
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          // Tenta mudar para a rede Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          // Se a rede não existe, adiciona ela
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SEPOLIA_NETWORK],
              });
            } catch (addError) {
              throw new Error('Não foi possível adicionar a rede Sepolia. Por favor, adicione manualmente na sua MetaMask.');
            }
          } else {
            throw new Error('Por favor, mude para a rede Sepolia para continuar.');
          }
        }
      }

      // Solicita acesso à carteira
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerInstance);
      
      const signerInstance = await providerInstance.getSigner();
      setSigner(signerInstance);
      
      const endereco = await signerInstance.getAddress();
      setEndereco(endereco);
      
      const contractInstance = new ethers.Contract(
        CONTRATO_ENDERECO,
        contratoABI,
        signerInstance
      );
      setContract(contractInstance);
      
      setEstaConectado(true);
      
      // Verifica status do contrato
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao conectar carteira:', err);
      setError(err.message || 'Erro ao conectar à carteira');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function desconectarCarteira() {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setEndereco('');
    setEstaConectado(false);
    setEComprador(false);
    setEVendedor(false);
  }

  async function atualizarStatus() {
    if (!contract) return;
    
    try {
      setLoading(true);
      
      // Busca informações do contrato
      const comprador = await contract.comprador();
      const vendedor = await contract.vendedor();
      const valor = await contract.valor();
      const valorFormatado = ethers.formatEther(valor);
      
      setDadosContrato({
        comprador,
        vendedor,
        valor: valorFormatado
      });
      
      // Verifica se o usuário atual é comprador ou vendedor
      setEComprador(endereco.toLowerCase() === comprador.toLowerCase());
      setEVendedor(endereco.toLowerCase() === vendedor.toLowerCase());
      
      // Busca status da transação
      const status = await contract.status();
      const pagamentoDepositado = await contract.pagamentoDepositado();
      const veiculoTransferido = await contract.veiculoTransferido();
      const transacaoFinalizada = await contract.transacaoFinalizada();
      
      setStatusTransacao({
        status: Number(status),
        pagamentoDepositado,
        veiculoTransferido,
        transacaoFinalizada
      });
      
      // Busca dados do veículo
      const veiculoInfo = await contract.veiculo();
      setDadosVeiculo({
        chassi: veiculoInfo.chassi,
        placa: veiculoInfo.placa
      });
      
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao buscar informações do contrato');
    } finally {
      setLoading(false);
    }
  }

  async function inicializarContrato(dados: {
    comprador: string;
    vendedor: string;
    valorEmEther: string;
    chassi: string;
    placa: string;
  }) {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await contract.inicializarContrato(
        dados.comprador,
        dados.vendedor,
        dados.valorEmEther,
        dados.chassi,
        dados.placa
      );
      
      await tx.wait();
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao inicializar contrato:', err);
      setError(err.message || 'Erro ao inicializar contrato');
    } finally {
      setLoading(false);
    }
  }

  async function depositarPagamento(valor: string) {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const valorWei = ethers.parseEther(valor);
      const tx = await contract.depositarPagamento({ value: valorWei });
      
      await tx.wait();
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao depositar pagamento:', err);
      setError(err.message || 'Erro ao depositar pagamento');
    } finally {
      setLoading(false);
    }
  }

  async function marcarTransferenciaVeiculo() {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await contract.marcarTransferenciaVeiculo();
      
      await tx.wait();
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao marcar transferência do veículo:', err);
      setError(err.message || 'Erro ao marcar transferência do veículo');
    } finally {
      setLoading(false);
    }
  }

  async function confirmarRecebimento() {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await contract.confirmarRecebimento();
      
      await tx.wait();
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao confirmar recebimento:', err);
      setError(err.message || 'Erro ao confirmar recebimento');
    } finally {
      setLoading(false);
    }
  }

  async function rejeitarVeiculo() {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await contract.rejeitarVeiculo();
      
      await tx.wait();
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao rejeitar veículo:', err);
      setError(err.message || 'Erro ao rejeitar veículo');
    } finally {
      setLoading(false);
    }
  }

  async function reembolsoAutomatico() {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await contract.reembolsoAutomatico();
      
      await tx.wait();
      await atualizarStatus();
    } catch (err: any) {
      console.error('Erro ao solicitar reembolso automático:', err);
      setError(err.message || 'Erro ao solicitar reembolso automático');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("block");
      }
    };
  }, []);

  return (
    <ContractContext.Provider
      value={{
        provider,
        signer,
        contract,
        endereco,
        conectarCarteira,
        desconectarCarteira,
        estaConectado,
        eComprador,
        eVendedor,
        statusTransacao,
        atualizarStatus,
        dadosVeiculo,
        dadosContrato,
        inicializarContrato,
        depositarPagamento,
        marcarTransferenciaVeiculo,
        confirmarRecebimento,
        rejeitarVeiculo,
        reembolsoAutomatico,
        loading,
        error
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract deve ser usado dentro de um ContractProvider');
  }
  return context;
}