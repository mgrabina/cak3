"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { IDKitWidget, ISuccessResult, VerificationLevel, useIDKit } from "@worldcoin/idkit";
import axios from "axios";
import { ConnectKitButton } from "connectkit";
import { NextPage } from "next";
import { set } from "nprogress";
import QRCode from "qrcode.react";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { useSignMessage } from "wagmi";
import { type BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "~~/abi/ContractAbi.json";
import { useRole } from "~~/components/ScaffoldEthAppWithProviders";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "~~/components/ui/dialog";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { useToast } from "~~/components/ui/use-toast";
import { host } from "~~/utils/misc";

function getQueryParams() {
  if (typeof window === "undefined") {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name"),
    email: params.get("email"),
    amount: params.get("amount"),
    valuation: params.get("valuation"),
    kycRequired: params.get("kycRequired"),
  };
}

const Home: NextPage = () => {
  const account = useAccount();

  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<any>({});

  useEffect(() => {
    setQueryParams(getQueryParams());
  }, []);

  const queryName = queryParams.name;
  const queryEmail = queryParams.email;
  const queryAmount = queryParams.amount;
  const queryValuation = queryParams.valuation;
  const queryKYCRequired = queryParams.kycRequired;

  const [done, setDone] = useState(false);
  const { setOpen } = useIDKit();

  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const [signed, setSigned] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const pathname = usePathname();

  const roleContext = useRole();

  // TODO: Functionality after verifying
  const onSuccess = () => {
    console.log("Success");
  };

  // TODO: Calls your implemented server route
  // const verifyProof = async proof => {
  //   throw new Error("TODO: verify proof server route");
  // };

  const submitTx = async (proof?: ISuccessResult) => {
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        account: account.address!,
        abi,
        functionName: "verifyAndExecute",
        args: [
          account.address!,
          proof ? BigInt(proof!.merkle_root) : "",
          proof ? BigInt(proof!.nullifier_hash) : "",
          decodeAbiParameters(parseAbiParameters("uint256[8]"), proof!.proof as `0x${string}`)[0],
        ],
      });
      setDone(true);
    } catch (error) {
      throw new Error((error as BaseError).shortMessage);
    }
  };
  const handleSign = async () => {
    const signature = signMessageAsync({
      message: "Sign this document to invest in Acme",
    })
      .then(signature => {
        console.log(signature);
        setSigned(true);
        toast({
          description: "Document signed successfully",
        });
      })
      .catch(error => {
        console.error(error);
        toast({
          description: "Error signing document",
        });
      });
  };

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7 grid grid-cols-12">
            <div className="col-span-10">
              <CardTitle>Invest in Acme</CardTitle>
              <CardDescription>
                You have received an invitation to invest in Acme's funding round. Follow the steps below.
              </CardDescription>
            </div>
            <div className="col-span-2">
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="float-right w-[150px]">
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleInvite}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="valuation" className="text-right">
                          Valuation
                        </Label>
                        <Input
                          id="valuation"
                          value={valuation}
                          onChange={e => setValuation(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Send</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 h-[800px] overflow-scroll">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer fileUrl="/saft.pdf" />;
                </Worker>
              </div>
              <div className="col-span-1">
                <div className="text-lg bold">Investment Details</div>
                <br></br>
                <p>
                  <strong>Name:</strong> {queryName}
                </p>
                <p>
                  <strong>Email:</strong> {queryEmail}
                </p>
                <p>
                  <strong>Amount:</strong> {queryAmount}
                </p>
                <p>
                  <strong>Valuation:</strong> {queryValuation}
                </p>
                <br></br>
                <div>
                  {" "}
                  {account.isConnected && roleContext?.role.role === "investor" ? (
                    <>
                      <IDKitWidget
                        app_id="app_staging_d8e1007ecb659d3ca0a6a9c4f6f61287"
                        action="investor-kyc"
                        signal={account.address}
                        onSuccess={submitTx}
                        autoClose
                      />
                      {!done &&
                        (queryKYCRequired === "true" ? (
                          <Button
                            onClick={() => {
                              setOpen(true);
                              handleSign();
                            }}
                          >
                            {!hash &&
                              (isPending
                                ? "Pending, please check your wallet..."
                                : "Verify Humanity and Execute Transaction")}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              submitTx(undefined);
                            }}
                          >
                            {!hash && (isPending ? "Pending, please check your wallet..." : "Sign Document")}
                          </Button>
                        ))}
                      {hash && (
                        <p>
                          See transaction in{" "}
                          <Link
                            className="cursor-pointer text-blue-500"
                            target="_blank"
                            href={`https://optimism-sepolia.blockscout.com/tx/${hash}`}
                          >
                            Blockscout
                          </Link>{" "}
                        </p>
                      )}
                      {isConfirming && <p>Waiting for confirmation...</p>}
                      {isConfirmed && <p>Transaction confirmed.</p>}
                      {error && <p>Error: {(error as BaseError).message}</p>}
                    </>
                  ) : (
                    <Button disabled className=" ">
                      You are not an investor
                    </Button>
                  )}{" "}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Home;
