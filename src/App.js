import { Alchemy, Network } from 'alchemy-sdk';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import './App.css';
import LatestBlocks from './components/LatestBlocks';
import LatestTransactions from './components/LatestTransactions';
import { useState } from 'react';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {

  const [address, setAddress] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => setAddress(e.target.value);

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      if(address.slice(0, 2) === "0x") {
        navigate(`/transaction/${address}`);
      }
      else {
        navigate(`/block/${address}`);
      }
    }
  }

  return (
    <div className="App">
      <div className='searchContainer'>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <Search />
          </InputLeftElement>
          <Input 
            placeholder='Search by Tx Hash / Block number'
            size='md'
            htmlSize={50}
            width='auto'
            value={address}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
      </div>
      <div className='BlockTxContainer'>
        <div className='Blocks'>
          <LatestBlocks alchemy={alchemy} />
        </div>
        <div className='Transactions'>
          <LatestTransactions alchemy={alchemy} />
        </div>
      </div>
    </div>
  );
}

export default App;
