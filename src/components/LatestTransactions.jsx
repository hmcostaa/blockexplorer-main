import React, { useEffect, useState } from 'react'
import { Alchemy, Utils } from 'alchemy-sdk';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { Skeleton } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import { Link } from "react-router-dom";


const LatestTransactions = ({ alchemy }) => {
  const [blockNumber, setBlockNumber] = useState();
  const [lastTransactions, setLastTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, [alchemy]);

  useEffect(() => {
    async function getLastTransactions() {
      setLoading(true);
      const latestBlockNumber = blockNumber || 0;

      const transactions = [];

      let latestTransactions = await alchemy.core.getBlockWithTransactions(blockNumber);
      latestTransactions.transactions.forEach((tx) => {
        if(transactions.length < 10) {
          tx.timestamp = latestTransactions.timestamp
          transactions.push(tx)
        }
      });

      setLastTransactions(transactions);
      setLoading(false);
    }

    if (blockNumber !== undefined) {
      getLastTransactions();
    }
  }, [alchemy, blockNumber]);

  const renderSkeletonRows = (count) => {
    const skeletonRows = [];
    for (let i = 0; i < count; i++) {
      skeletonRows.push(
        <Tr key={i}>
          <Td>
            <Skeleton>0x2ea4bf48b299d...</Skeleton>
          </Td>
          <Td>
            <Skeleton>0x04eE14d114aa3...</Skeleton>
          </Td>
          <Td>
            <Skeleton>0x7A3bC5D6D5524...</Skeleton>
          </Td>
          <Td>
            <Skeleton>0.000000000189250677ETH</Skeleton>
          </Td>
        </Tr>
      );
    }
    return skeletonRows;
  };

  function calculateTimeElapsed(transactionTime) {
    const currentDate = new Date();

    const startDate = new Date(transactionTime * 1000);

    const timeDifference = currentDate - startDate;

    const secondsPassed = Math.round(timeDifference / 1000);

    return secondsPassed
  }

  return (
    <div>
      <TableContainer>
        <Table variant='striped' size='lg' colorScheme='telegram'>
          <TableCaption placement='top'>Latest Transactions</TableCaption>
          <Thead>
            <Tr>
              <Th isNumeric>Transaction Hash</Th>
              <Th isNumeric>From</Th>
              <Th isNumeric>To</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
            <Tbody>
            {loading ? (
              renderSkeletonRows(10)
            ) : (
              lastTransactions.map((tx, index) => (
                <Tr key={index}>
                  <Td>
                    <div style={{height: 100 + "%"}}>
                      <Tooltip label={tx.hash.toString()} placement='top'>
                        <Link to={`/transaction/${tx.hash}`} state={{timestamp: tx.timestamp}} style={{color: "rgb(7,132,195)"}}>{tx.hash.toString().slice(0, 15) + '...'}</Link>
                      </Tooltip>
                      <p style={{fontSize: 10 + 'px', position: "absolute", color: "#666"}}>{calculateTimeElapsed(tx.timestamp) + ' secs ago'}</p>
                    </div>
                  </Td>
                  <Td>{tx.from.toString().slice(0, 15) + '...'}</Td>
                  <Td>{tx.to.toString().slice(0, 15) + '...'}</Td>
                  <Td>{Utils.formatEther(tx.value).toString() + ' ETH'}</Td>
                </Tr>
              ))
            )}
            </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default LatestTransactions