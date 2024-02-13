import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text, Button } from '@chakra-ui/react'
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { Skeleton } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const Block = () => {
    const { blockId } = useParams();
    const [block, setBlock] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function getBlock() {
            setLoading(true);
            setBlock(await alchemy.core.getBlockWithTransactions(parseInt(blockId)));
            setLoading(false);
        }
      
        getBlock();
    }, [alchemy]);

    function calculateTimeElapsed(blockTime) {
        const currentDate = new Date();
    
        const startDate = new Date(blockTime * 1000);
    
        const timeDifference = currentDate - startDate;
    
        const secondsPassed = Math.round(timeDifference / 1000);
    
        return secondsPassed
    }

    const renderSkeletonRows = () => {
        return (
            <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                    <Skeleton>
                        <Heading size='xs' textTransform='uppercase'>
                        Summary
                        </Heading>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Hash: 0x8048aab0e0bdf7bf3c3a8c44be7b46e7faac978ea9aff1a2333cb68f0ea9f248
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Timestamp: 18 secs ago
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Transactions: 107
                        </Text>
                    </Skeleton>
                </Box>
                <Box>
                    <Skeleton>
                        <Heading size='xs' textTransform='uppercase'>
                        Overview
                        </Heading>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Fee Recipient (Miner): 0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Difficulty: 45354345345354
                        </Text>
                    </Skeleton>
                </Box>
                <Box>
                    <Skeleton>
                        <Heading size='xs' textTransform='uppercase'>
                        Analysis
                        </Heading>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Gas Used: 26230741 Wei
                        </Text>
                    </Skeleton>
                </Box>
            </Stack>
        )
    };

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%"}}>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "20px"}}>
                <Stack direction='row' spacing={4}>
                    <Button leftIcon={<ArrowLeft />} colorScheme='teal' variant='solid' onClick={() => navigate("/")}>
                        Return
                    </Button>
                </Stack>
            </div>
            <div>
                <Card colorScheme='telegram'>
                    <CardHeader>
                        <Heading size='md'>Block {blockId}</Heading>
                    </CardHeader>

                    <CardBody>
                        {loading ? (
                            renderSkeletonRows()
                        ) : (
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                    Summary
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                    Hash: {block.hash}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Timestamp: {calculateTimeElapsed(block.timestamp) + ' secs ago'}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Transactions: {block.transactions.length}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                    Overview
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                    Fee Recipient (Miner): {block.miner}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Difficulty: {block.difficulty}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                    Analysis
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                    Gas Used: {block.gasUsed.toString() + " Wei"}
                                    </Text>
                                </Box>
                            </Stack>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Block