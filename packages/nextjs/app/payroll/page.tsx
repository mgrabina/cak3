"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { NextPage } from "next";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { useToast } from "~~/components/ui/use-toast";

const Home: NextPage = () => {
  const [email, setEmail] = useState("martin@targecy.xyz");
  const [role, setRole] = useState("investor");
  const { toast } = useToast();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !role || ["investor", "employee", "founder"].indexOf(role) === -1) {
      return;
    }

    try {
      await axios.post("/api/send-credential-email", {
        email,
        role,
      });
      toast({
        description: "Your invite has been sent.",
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "Your invite has failed.",
      });
    }
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
      {/* <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-12" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Payroll Overview</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful Analysis.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Create New Order</Button>
            </CardFooter>
          </Card>
        </div> */}
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>
            <div className="col-span-10">
              <CardTitle>Company</CardTitle>
              <CardDescription>The list of members you have invited.</CardDescription>
            </div>
            <div className="col-span-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="float-right w-[150px]">
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleInvite}>
                    <div className="grid gap-4 py-4">
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
                        <Label htmlFor="role" className="text-right">
                          Role
                        </Label>
                        <Input id="role" value={role} onChange={e => setRole(e.target.value)} className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Send</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
          <CardDescription>
            6<span className="text-muted-foreground"> members</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Wallet</TableHead>
                <TableHead className="hidden sm:table-cell">Paycheck</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-accent">
                <TableCell>
                  <div className="font-medium">Liam Johnson</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">liam@acme.com</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">0xas3...2jkd</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    $8.000
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-02-23</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Emma Brown</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">emma@acme.com</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">0xkw1k...3kfj</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    $7.500
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-04-14</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Liam Johnson</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">liam@acme.com</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">0x4ldl...3kdo</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    $12.000
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-01-30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Liam Johnson</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">liam@acme.com</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">0x2kdo...k45j</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    $3.400
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-02-23</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Olivia Smith</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">olivia@acme.com</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">0xk21j...96jf</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    $5.4000
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-04-23</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Emma Brown</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">emma@acme.com</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">0xr34...hd13</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    $4.500
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-05-23</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button disabled>Create New Employee</Button>
          <Button className="ml-4">Pay Now ($123,000)</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
