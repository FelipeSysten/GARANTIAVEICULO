import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ContractProvider } from './contexts/ContractContext';
import { Header } from './components/Header';
import { StatusCard } from './components/StatusCard';
import { InitializeContract } from './components/InitializeContract';
import { BuyerActions } from './components/BuyerActions';
import { SellerActions } from './components/SellerActions';
import { BemVindo } from './components/BemVindo';

function App() {
  return (
    <ThemeProvider>
      <ContractProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <BemVindo />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1">
                <StatusCard />
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <InitializeContract />
                <BuyerActions />
                <SellerActions />
              </div>
            </div>
          </main>
          
          <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© 2025 Sistema de Garantia de Veículo - Todos os direitos reservados</p>
          </footer>
        </div>
      </ContractProvider>
    </ThemeProvider>
  );
}

export default App;