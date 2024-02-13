import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text, Button } from '@chakra-ui/react'
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { Skeleton } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const Transaction = () => {
    const { txId } = useParams();
    const [tx, setTx] = useState();
    const [timestamp, setTimestamp] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    let { state } = useLocation();

    useEffect(() => {
        async function getTransaction() {
            console.log(txId);
            setLoading(true);
            setTx(await alchemy.transact.getTransaction(txId));
            if(state !== null) {
                setTimestamp(state.timestamp);
            }
            setLoading(false);
        }
      
        getTransaction();
    }, [alchemy]);

    useEffect(() => {
        async function getTimestamp() {
            setLoading(true);
            let block;
            try {
                block = await alchemy.core.getBlock(parseInt(tx.blockNumber));
            }
            catch(e) {
                console.log("Block Number hasn't arrived");
            }
            finally {
                setTimestamp(block.timestamp);
            }
            setLoading(false);
        }

        if(state === null) {
            getTimestamp();
        }
    }, [tx]);

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
                        Block: 19215824
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Timestamp: 90000 secs ago
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Block Confirmations: 123456789
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        ChainId: 123
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
                        From: 0x77ad3a15b78101883AF36aD4A875e17c86AC65d1
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        To: 0x00000000A991C429eE2Ec6df19d40fe0c80088B8
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Value: 0.000000000303490547 ETH
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
                        Gas Price: 45063741430 Wei
                        </Text>
                    </Skeleton>
                    <Skeleton>
                        <Text pt='2' fontSize='sm'>
                        Gas Limit: 202770 Wei
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
                        <Heading size='md'>Transaction {txId}</Heading>
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
                                    Block: {tx.blockNumber}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Timestamp: {calculateTimeElapsed(timestamp) + ' secs ago'}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Block Confirmations: {tx.confirmations}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    ChainId: {tx.chainId}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                    Overview
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                    From: {tx.from}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    To: {tx.to}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Value: {Utils.formatEther(tx.value).toString() + ' ETH'}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                    Analysis
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                    Gas Price: {tx.gasPrice.toString() + " Wei"}
                                    </Text>
                                    <Text pt='2' fontSize='sm'>
                                    Gas Limit: {tx.gasLimit.toString() + " Wei"}
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

export default Transaction