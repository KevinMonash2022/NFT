
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, ethers, providers } from "ethers";

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

export type Web3Params = {
    ethereum: MetaMaskInpageProvider | null;
    provider: providers.Web3Provider | null;
    contract: Contract | null;
}

export type Web3State = {
    isLoading: boolean; // true while loading web3State
} & Web3Params

export const createDefaultState = () => {
    return {
        ethereum: null,
        provider: null,
        contract: null,
        isLoading: true,
    }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

// console.log("Network ID from .env:", process.env.NEXT_PUBLIC_NETWORK_ID);
// console.log("Network ID in use:", NETWORK_ID);



export const loadContract = async (
    name: string,  // NftMarket
    provider: providers.Web3Provider
): Promise<Contract> => {

    // console.log("Network ID is:", NETWORK_ID);
    debugger
    if (!NETWORK_ID) {
        return Promise.reject("Network ID is not defined!");
    }

    debugger
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    // console.log("Artifact data:", Artifact);
    // console.log("Network configurations:", Artifact.networks);

    debugger
    const ID = parseInt(NETWORK_ID, 10);
    // console.log("ID is ", ID)
    // console.log("Network-specific config:", Artifact.networks[ID]);
    // console.log("Network-specific config 5777:", Artifact.networks[5777]);

    const Address = Artifact.networks[ID].address

    if (Address) {
        const contract = new ethers.Contract(
            Address,
            Artifact.abi,
            provider
        )
        debugger
        return contract;
    } else {
        return Promise.reject(`Contract: [${name}] cannot be loaded!`);
    }
}