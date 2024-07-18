import {
    SmartContract,
    assert,
    method,
    prop,
    DefaultProvider,
    bsv
} from 'scrypt-ts'
import { NeucronSigner } from 'neucron-signer'

class Multiplier extends SmartContract {
    @prop()
    multiplicand: bigint

    @prop()
    multiplier: bigint

    constructor(multiplicand: bigint, multiplier: bigint) {
        super(...arguments)
        this.multiplicand = multiplicand
        this.multiplier = multiplier
    }

    @method()
    public unlock(product: bigint) {
        assert(product == this.multiplicand * this.multiplier, 'incorrect product')
    }
}

async function main() {
    // Initialize provider and signer
    const provider = new DefaultProvider({ network: bsv.Networks.mainnet })
    const signer = new NeucronSigner(provider)
    const amount = 2 // Set the amount for deployment

    // Log in to the signer
    await signer.login('your-email@example.com', 'your-password')
    await Multiplier.loadArtifact()

    // Define the parameters for the Multiplier contract
    const multiplicand = BigInt(3)
    const multiplier = BigInt(7)
    const instance = new Multiplier(multiplicand, multiplier)
    await instance.connect(signer)

    // Deploy the Multiplier contract
    const deployTx = await instance.deploy(amount)
    console.log(
        'Multiplier contract deployed : https://whatsonchain.com/tx/' + deployTx.id
    )

    // Interact with the deployed contract
    const product = multiplicand * multiplier
    await new Promise((f) => setTimeout(f, 5000)) // Wait for a few seconds before interacting
    const { tx: callTx } = await instance.methods.unlock(product)
    console.log(
        'Multiplier contract unlocked successfully : https://whatsonchain.com/tx/' + callTx.id
    )
}

main()
