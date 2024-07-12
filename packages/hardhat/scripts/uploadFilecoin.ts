// Following doc
// https://web3.storage/docs/w3up-client/
import { create } from "@web3-storage/w3up-client";

// Provision client, space, and login account
const client = await create();

const space = await client.createSpace(env.process.STORAGE_SPACE);

// Triggers a confirmatoin email that should be attended within it's expiration time.
const myAccount = await client.login(env.process.FILECOIN_ACCOUNT);

// Check for payment plan
while (true) {
  const res = await myAccount.plan.get();
  if (res.ok) break;
  console.log("Waiting for payment plan to be selected...");
  await new Promise(resolve => setTimeout(resolve, 1000));
}

await myAccount.provision(space.did());

await space.save();

await client.setCurrentSpace(space.did());
