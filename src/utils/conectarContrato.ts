import { ethers } from "ethers";
import { contratoABI } from "./contratoABI";

const CONTRATO_ENDERECO = '0x0Dc295b143976687785aFA916fD44BCd0D44752C';

export async function conectarContrato() {
  if (!window.ethereum) throw new Error("Metamask não detectada");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const rede = await provider.getNetwork();

  if (Number(rede.chainId) !== 11155111) {
    throw new Error("Conecte-se à rede Sepolia");
  }

  const contrato = new ethers.Contract(CONTRATO_ENDERECO, contratoABI, signer);
  return { contrato, signer, provider };
}
