# Paintoshi Account Validator

Sign or validate accounts with Web3. Any chain, simple and secure.

### Live at https://auth.cash

![Screenshot](https://github.com/paintoshi/account-validator/blob/main/public/images/screenshot.png?raw=true)

### Example:

1. You want someone to validate their ownership of an ethereum compatible account. You send them a custom message for example "Hello Sir".
2. The person connects with that account, enters the message, sign and send back the signature to you.
3. You enter the account, message and signature. If it says valid, you know that the signer has 100% access to that account. Also at that particular time, since they didn't know the message in advance.

## Development

Prerequisites:

* Node 18

Run development server:

Copy .env.sample to .env.local and add wallet connect project ID

```bash
yarn install
yarn dev
```

Build:

```bash
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.