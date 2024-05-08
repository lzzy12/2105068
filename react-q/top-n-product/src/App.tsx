import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter, } from 'react-router-dom';
import CompanyProducts from './pages/Catalogue';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<CompanyProducts/>} />
          {/* <Route path="/product/:productId" component={ProductDetails} /> */}
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;