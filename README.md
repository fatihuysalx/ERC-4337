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
