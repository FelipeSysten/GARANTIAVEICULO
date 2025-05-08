import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import NovaTransacao from './components/NovaTransacao';
import ListaContratos from './components/ListaContratos';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import { Car, FileSignature } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          
          <main className="container mx-auto py-8 px-4">
            <Tabs defaultValue="contratos" className="w-full max-w-4xl mx-auto">
              <TabsList className="mb-8 flex justify-center">
                <TabsTrigger value="contratos" className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Meus Contratos</span>
                </TabsTrigger>
                <TabsTrigger value="nova-transacao" className="flex items-center space-x-2">
                  <FileSignature className="w-4 h-4" />
                  <span>Novo Contrato</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="contratos">
                <ListaContratos />
              </TabsContent>
              
              <TabsContent value="nova-transacao">
                <NovaTransacao />
              </TabsContent>
            </Tabs>
          </main>
          
          <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
              <p>&copy; 2025 Garantia de Veículos. Todos os direitos reservados.</p>
              <p className="mt-1">Garantia de transações de veículos utilizando blockchain</p>
            </div>
          </footer>
        </div>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;