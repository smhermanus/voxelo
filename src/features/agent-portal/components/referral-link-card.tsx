"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  referralCode:   string;
  baseUrl:        string;
  clientCount:    number;
  viaLinkCount:   number;
}

export function ReferralLinkCard({ referralCode, baseUrl, clientCount, viaLinkCount }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${baseUrl}/ref/${referralCode}`;

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your referral link</CardTitle>
          <CardDescription>
            Share this link with potential clients. When they sign up through it,
            they are automatically attributed to you — you earn commission on every
            payment they make.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Link display */}
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
            <span className="flex-1 truncate text-sm font-mono text-foreground">{url}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={copy}
              className="shrink-0 gap-1.5"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="shrink-0"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card px-4 py-3 text-center">
              <p className="text-2xl font-bold">{clientCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total clients</p>
            </div>
            <div className="rounded-lg border bg-card px-4 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{viaLinkCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Signed up via this link</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage tips */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Tips for sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold shrink-0">1.</span>
              The link works for 30 days — even if the prospect doesn&apos;t sign up immediately.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold shrink-0">2.</span>
              Attribution is automatic once they create their Voxelo account.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold shrink-0">3.</span>
              If a client signs up without your link, ask your admin to manually assign them to you.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold shrink-0">4.</span>
              Commission is calculated on each successful subscription payment — pending approval by admin.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
