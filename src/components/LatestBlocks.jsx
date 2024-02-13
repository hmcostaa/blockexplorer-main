import React, { useEffect, useState } from 'react'
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
import { Link } from "react-router-dom";

const LatestBlocks = ({ alchemy }) => {
  const [blockNumber, setBlockNumber] = useState();
  const [lastBlocks, setLastBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, [alchemy]);

  useEffect(() => {
    async function getLastBlocks() {
      setLoading(true);
      const latestBlockNumber = blockNumber || 0;
      const startBlockNumber = Math.max(1, latestBlockNumber - 9);

      const blocks = [];
      for (let i = latestBlockNumber; i >= startBlockNumber; i--) {
        const block = await alchemy.core.getBlock(i);

        blocks.push(block);
      }

      setLastBlocks(blocks);
      setLoading(false);
    }

    if (blockNumber !== undefined) {
      getLastBlocks();
    }
  }, [alchemy, blockNumber]);

  const renderSkeletonRows = (count) => {
    const skeletonRows = [];
    for (let i = 0; i < count; i++) {
      skeletonRows.push(
        <Tr key={i}>
          <Td>
            <Skeleton>19208033</Skeleton>
          </Td>
          <Td>
            <Skeleton>0xDAFEA492D9c67...</Skeleton>
          </Td>
          <Td>
            <Skeleton>13836669</Skeleton>
          </Td>
          <Td>
            <Skeleton>134</Skeleton>
          </Td>
        </Tr>
      );
    }
    return skeletonRows;
  };

  function calculateTimeElapsed(blockTime) {
    const currentDate = new Date();

    const startDate = new Date(blockTime * 1000);

    const timeDifference = currentDate - startDate;

    const secondsPassed = Math.round(timeDifference / 1000);

    return secondsPassed
  }

  return (
    <div>
      <TableContainer>
        <Table variant='striped' size='lg' colorScheme='telegram'>
          <TableCaption placement='top'>Latest Blocks</TableCaption>
          <Thead>
            <Tr>
              <Th isNumeric>Block</Th>
              <Th>Fee Recipient</Th>
              <Th isNumeric>Gas Used</Th>
              <Th isNumeric>Transactions</Th>
            </Tr>
          </Thead>
            <Tbody>
            {loading ? (
              renderSkeletonRows(10)
            ) : (
              lastBlocks.map((block, index) => (
                <Tr key={index}>
                  <Td>
                    <div style={{height: 100 + "%"}}>
                      <Link to={`/block/${block.number}`} style={{color: "rgb(7,132,195)"}}>{block.number}</Link>
                      <p style={{fontSize: 10 + 'px', position: "absolute", color: "#666"}}>{calculateTimeElapsed(block.timestamp) + ' secs ago'}</p>
                    </div>
                  </Td>
                  <Td>{block.miner.toString().slice(0, 15) + '...'}</Td>
                  <Td>{block.gasUsed.toString() + " Wei"}</Td>
                  <Td>{block.transactions.length}</Td>
                </Tr>
              ))
            )}
            </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default LatestBlocks