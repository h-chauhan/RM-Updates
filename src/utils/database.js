import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT, 
    key: process.env.COSMOS_DB_KEY
});

const database = client.database('dtu-rm-updates');

const container = database.container('subscribers');

export const getSubscriber = async (senderId, senderName) => { 
    const id = `${senderId}:${senderName}`;
    const { resource } = await container.item(id, senderId).read();
    return resource;
};

export const saveSubscriber = async (senderId, senderName) => {
    const { resource } = await container.items.create({
        id: `${senderId}:${senderName}`,
        senderId,
        senderName
    });
    return resource;
};

export const updateSubscriber = async (senderId, senderName, subscriptionType) => {
    const id = `${senderId}:${senderName}`;
    const { resource } = await container.item(id, senderId).replace({
        id: `${senderId}:${senderName}`,
        senderId,
        senderName,
        type: subscriptionType,
    });
    return resource;
};

export const getSubscribersByType = async (subscriptionType) => {
    const querySpec = {
        query: `SELECT * FROM c WHERE c.type="${subscriptionType}"`
    };
    const { resources: subscribers } = await container.items.query(querySpec).fetchAll();
    return subscribers;
};