// Dados do contrato inteligente
export const CONTRACT_ADDRESS = '0x4F2169ab936d2AA162a5f2BA4c83aB4E606999ED';

export const CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "confirmarRecebimento",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contadorContratos",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contratos",
		"outputs": [
			{
				"internalType": "address",
				"name": "comprador",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "vendedor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "pagamentoDepositado",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "veiculoTransferido",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "transacaoFinalizada",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "tempoTransferencia",
				"type": "uint256"
			},
			{
				"internalType": "enum GarantiaVeiculoMultiContratos.StatusVeiculo",
				"name": "status",
				"type": "uint8"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "chassi",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "placa",
						"type": "string"
					}
				],
				"internalType": "struct GarantiaVeiculoMultiContratos.Veiculo",
				"name": "veiculo",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "dadosVeiculo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "depositarPagamento",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_comprador",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_vendedor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_valorEmEther",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_chassi",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_placa",
				"type": "string"
			}
		],
		"name": "inicializarContrato",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "marcarTransferenciaVeiculo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "rejeitarVeiculo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// Enum do status do veículo para facilitar a exibição
export enum StatusVeiculo {
  Pendente = 0,
  Aceito = 1,
  Rejeitado = 2
}

// Tipo para representar os dados do contrato
export interface Contrato {
  comprador: string;
  vendedor: string;
  valor: string;
  pagamentoDepositado: boolean;
  veiculoTransferido: boolean;
  transacaoFinalizada: boolean;
  tempoTransferencia: number;
  status: StatusVeiculo;
  veiculo: {
    chassi: string;
    placa: string;
  };
}