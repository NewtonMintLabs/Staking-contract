require('dotenv').config()

// const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    // rinkedby: {
    //   provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rinkedby.infura.io/v3/` + process.env.PROJECT_ID),
    //   network_id: 3,       // Ropsten's id
    //   gas: 5500000,        // Ropsten has a lower block limit than mainnet
    //   confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 30000000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 1
       },
       evmVersion: "byzantium"
      }
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  // api_keys: {
  //   etherscan: process.env.ETHERSCAN_APIKEY
  // }
};
