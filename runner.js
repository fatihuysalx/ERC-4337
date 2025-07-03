// Load environment variables from .env file
import 'dotenv/config';

// Import required modules from viem
import { createPublicClient, http, encodeFunctionData, parseUnits } from 'viem';

// Import account creation helper from viem
import { privateKeyToAccount } from 'viem/accounts';

// Import smart account setup functions from permissionless
import { toSimpleSmartAccount } from 'permissionless/accounts';
import { createSmartAccountClient } from 'permissionless';

// Import Pimlico client creator
import { createPimlicoClient } from 'permissionless/clients/pimlico';

// Import Pimlico gas price fetching method
import { getUserOperationGasPrice } from 'permissionless/actions/pimlico';

async function main() {
  // Prepare Pimlico bundler URL with API key
  const bundlerUrl = `${process.env.BUNDLER_URL}?apikey=${process.env.PIMLICO_API_KEY}`;

  // Create a public RPC client to read on-chain data
  const publicClient = createPublicClient({
    chain: { id: 42161 }, // Arbitrum One network
    transport: http(process.env.ARBITRUM_RPC_URL)
  });

  // Convert the owner's private key to an account object
  const owner = privateKeyToAccount(process.env.OWNER_PRIVATE_KEY.trim());

  // Initialize the user's smart account using the SimpleAccount factory
  const account = await toSimpleSmartAccount({
    client: publicClient,
    owner,
    entryPoint: { address: process.env.ENTRYPOINT_ADDRESS, version: '0.6' },
    simpleAccountAddress: process.env.SIMPLEACCOUNT_ADDRESS
  });

  // Create Pimlico client to access bundler and paymaster services
  const pimlicoClient = createPimlicoClient({
    transport: http(bundlerUrl),
    chain: { id: 42161 }
  });

  // Fetch real-time gas prices from Pimlico
  const gasPrices = await getUserOperationGasPrice(pimlicoClient);
  console.log('📢 Gas Prices:', gasPrices);

  // Create smart account client to send UserOperations via the bundler
  const smartAccountClient = createSmartAccountClient({
    account,
    chain: { id: 42161 },
    bundlerTransport: http(bundlerUrl)
    // Pimlico automatically uses the public paymaster, no middleware needed
  });

  // Encode the ERC20 token transfer function call
  const calldata = encodeFunctionData({
    abi: [{
      type: 'function',
      name: 'transfer',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }]
    }],
    functionName: 'transfer',
    args: [process.env.RECIPIENT_ADDRESS, parseUnits('0.1', 6)] // Send 0.1 USDT (6 decimals)
  });

  // Send the transaction via smart account and bundler
  const txHash = await smartAccountClient.sendTransaction({
    to: process.env.TESTTOKEN_ADDRESS, // USDT token contract address
    data: calldata, // Encoded transfer function
    value: 0n, // No native ETH sent
    maxFeePerGas: gasPrices.standard.maxFeePerGas, // Gas fee from Pimlico
    maxPriorityFeePerGas: gasPrices.standard.maxPriorityFeePerGas
  });

  console.log('✅ UserOperation sent using Pimlico paymaster, TxHash:', txHash);
}

// Run the main function and catch any errors
main().catch(console.error);
