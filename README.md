RC-4337 System Overview

What is ERC-4337?

ERC-4337 (Account Abstraction) is a new standard that upgrades the traditional Ethereum transaction flow. It allows smart contracts to act as wallets, enabling flexible signature validation, sponsored (gasless) transactions, batch transactions, social recovery, and more.

Key Difference: Instead of using eth_sendTransaction with Externally Owned Accounts (EOA), ERC-4337 introduces UserOperations which are processed via a Bundler and EntryPoint.

Key Components and Their Roles

1. Smart Account (SimpleAccount)

A smart contract wallet.

Executes transactions.

Custom signature logic.

Communicates with EntryPoint via UserOperations.

2. Owner

Regular EOA (Externally Owned Account).

Signs the UserOperations.

Authorizes the Smart Account to perform actions.

3. Relayer

Optional, usually used to submit UserOperations on behalf of Smart Account.

Handles sending transactions to the Bundler.

In this setup, Pimlico SDK abstracts this role.

4. Paymaster

Sponsors the gas fee for the UserOperation.

Can have policies to control who they sponsor.

In this project, Pimlico's public paymaster is used.

5. Bundler

Collects UserOperations.

Packages them into a block to send to EntryPoint.

Pimlico's HTTP-based bundler is used.

6. EntryPoint

The core contract of ERC-4337.

Validates and executes UserOperations.

Works like a "universal processor" for smart accounts.

7. Recipient

The address that will receive the token or ETH.

8. RPC / HTTP

RPC: Remote procedure call to communicate with the blockchain.

HTTP: Transport protocol to send RPC requests to Bundler and blockchain nodes.

Money Flow

[ Owner (EOA) ]
       |
Signs UserOperation
       |
[ Smart Account (SimpleAccount) ]
       |
Sends UserOperation to
       |
[ Bundler (via HTTP) ]
       |
Forwards to
       |
[ EntryPoint Contract ]
   |               |
Validate        Execute
   |               |
  Paymaster    Recipient receives funds
    Sponsors gas

Chain Used

Arbitrum One (Mainnet)

Pimlico Bundler and Paymaster are fully compatible with this network.

HTTP-based RPC used for communication.

Summary

Component

Purpose

Smart Account

Executes the transaction

Owner

Signs the UserOperation

Relayer

Sends transactions (abstracted)

Paymaster

Pays for gas

Bundler

Collects and forwards UserOperations

EntryPoint

Validates and processes transactions

Recipient

Receives the transferred funds

HTTP/RPC

Connects to blockchain and bundler

If you follow this flow, you can understand ERC-4337 transactions at a glance.


ERC-4337 Gasless USDT Transfer using Pimlico Paymaster
This project demonstrates a gasless token transfer using Account Abstraction (ERC-4337) on the Arbitrum Mainnet with Pimlico’s public bundler and paymaster.

We use:

✅ Viem for low-level blockchain interaction

✅ Permissionless.js for smart account management

✅ Pimlico SDK for bundler and paymaster services

No Hardhat, no Ethers.js, no @account-abstraction/sdk.

🔧 Setup
Prerequisites:
Node.js v20.x

NPM

Dependencies:
bash
Kopyala
Düzenle
npm install viem@^2.31.6 permissionless@^0.2.47 dotenv@^17.0.0 axios@^1.10.0
Used Packages:

viem: Blockchain client for low-level RPC interaction

permissionless: Pimlico's smart account and bundler SDK

dotenv: Environment variable management

axios: HTTP requests (optional, not core)

🌐 Network & Services
Bundler: Pimlico Public Bundler

Paymaster: Pimlico Public Paymaster (automatically selected)

Chain: Arbitrum Mainnet

📦 Technologies
Tool	Purpose
Viem	Low-level RPC communication
Permissionless.js	Smart Account management
Pimlico SDK	Bundler & Paymaster connection
Node.js	Backend runtime environment

📄 Environment Variables Setup
Create a .env file in your project root with the following structure:

ini
Kopyala
Düzenle
ARBITRUM_RPC_URL=YOUR_ARBITRUM_MAINNET_RPC_URL
BUNDLER_URL=https://api.pimlico.io/v2/42161/rpc
PIMLICO_API_KEY=YOUR_PIMLICO_API_KEY
ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789

OWNER_PRIVATE_KEY=YOUR_OWNER_PRIVATE_KEY
OWNER_ADDRESS=YOUR_OWNER_ADDRESS

TESTTOKEN_ADDRESS=YOUR_TESTTOKEN_ADDRESS
RECIPIENT_ADDRESS=YOUR_RECIPIENT_ADDRESS
SIMPLEACCOUNT_ADDRESS=YOUR_SIMPLEACCOUNT_ADDRESS
📌 How to Get These Values:
ARBITRUM_RPC_URL: You can get it from Alchemy or Infura for Arbitrum Mainnet.

BUNDLER_URL: Provided by Pimlico.

PIMLICO_API_KEY: You can get it from Pimlico Dashboard.

ENTRYPOINT_ADDRESS: Standard entry point address for ERC-4337 (already provided).

OWNER_PRIVATE_KEY: Your local wallet’s private key.

OWNER_ADDRESS: The address derived from your private key.

TESTTOKEN_ADDRESS: Address of the ERC-20 token you want to transfer.

RECIPIENT_ADDRESS: Address where the token will be sent.

SIMPLEACCOUNT_ADDRESS: Deployed smart account address.

🔐 Why We Didn’t Manually Use the Owner?
In our setup, the owner was automatically used by the Pimlico SDK.
We did not need to handle manual signature or transaction building.

How it Works:
The owner's private key is passed to the toSimpleSmartAccount function.

Pimlico's SDK automatically:

Creates the smart account.

Signs the UserOperation on behalf of the owner.

Sends the transaction using the smart account as the sender.

There was no need to manually sign or manually configure the UserOperation because:

Pimlico’s createSmartAccountClient handles the entire flow.

The SDK directly communicates with the Bundler and EntryPoint using the smart account.

💡 If you wanted to handle manual signing, you would need to work with low-level UserOperations and potentially custom middleware.
