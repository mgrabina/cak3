"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";
import { NextPage } from "next";
import { useSignMessage } from "wagmi";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "~~/components/ui/dialog";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { useToast } from "~~/components/ui/use-toast";

const Home: NextPage = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const queryName = searchParams.get("name");
  const queryEmail = searchParams.get("email");
  const queryAmount = searchParams.get("amount");
  const queryValuation = searchParams.get("valuation");

  const [signed, setSigned] = useState(false);
  const { signMessageAsync } = useSignMessage();

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
                {!signed ? (
                  <Button onClick={handleSign} className="w-[100px]">
                    Sign
                  </Button>
                ) : (
                  <Button disabled className="w-[100px]">
                  Signed
                </Button>
                )}
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
