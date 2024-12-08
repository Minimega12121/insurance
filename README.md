# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Ethereum Attestation Service
We are using Ethereum Attestation Service for attesting the SHA256 health records and the corresponding users wallet addresses.

This ensures that the AI Agent is granted the access to the users data, if and only if the hash of the records submitted by the user matches with the attested record. 

Firstly, the trusted Hospitals, which are the partners of the Insurance company have the access to create attestations, consisting of the record and the users wallet address.<br>
Then, the users, when applying for insurance, give the data, and their wallet address. We can loop through the attestations of the corresponding wallet, and check if the document was attested to the user by any hospital.

This way we can manage control and Access of sensitive data to AI agents, and them subsequeently talking to other agents 

<b>Schema ID for Hospital Records:</b> https://sepolia.easscan.org/schema/view/0x779d51ae429a271b4384453f955b4620375cbc8e727b43c1f4306aab9409038f
<br>
<b> Transaction id of Schema: </b>  0x779d51ae429a271b4384453f955b4620375cbc8e727b43c1f4306aab9409038f
<br>
<b>Example Onchain Attestation ID: </b>0x2238f03eb415824d725e809253f0c3928e87898cca44eb4121e4ff2815ceccb1


Also, when the entire process is done, and the verdict of the Insurance approval is attested. This can be a way to measure the history and reputation of another Agent. Also, anyone( human or agent) can verify the validity of the claims made by any agent.

<b>Schema ID for Insurance Records:</b> https://base-sepolia.easscan.org/schema/view/0x80eb3e1cd8df4b058822ed156660dbc73753f36efaa1be495a7c8ef40086ecde
<br>
<b> Transaction id of Schema: </b>  0x80eb3e1cd8df4b058822ed156660dbc73753f36efaa1be495a7c8ef40086ecde
<br>
<b>Example Onchain Attestation ID: </b>0x2eb5ba3523b17555bd8e6aba7f593e71b57520f329b9fa55286e0d11c932f352