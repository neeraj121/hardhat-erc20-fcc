export interface networkConfigItem {
    blockConfirmations?: number;
    ethUsdPriceFeed?: string;
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    localhost: {
        blockConfirmations: 1,
        ethUsdPriceFeed: "30",
    },
    hardhat: {
        blockConfirmations: 1,
        ethUsdPriceFeed: "30",
    },
    rinkeby: {
        blockConfirmations: 6,
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
};

export const INITIAL_SUPPLY = "1000000000000000000000";

export const developmentChains = ["hardhat", "localhost"];
