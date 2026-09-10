"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, Loader2Icon } from "lucide-react";
import { searchRecords } from "@/actions/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function RecordsSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    try {
      const data = await searchRecords(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, number, email, phone..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {results && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResultSection title="Tenants" items={results.tenants} hrefPrefix="/dashboard/tenants" labelKey="firstName" subKey="lastName" />
          <ResultSection title="Leases" items={results.leases} hrefPrefix="/dashboard/leases" labelKey="leaseNumber" />
          <ResultSection title="Invoices" items={results.invoices} hrefPrefix="/dashboard/finance/invoices" labelKey="invoiceNumber" />
          <ResultSection title="Tickets" items={results.tickets} hrefPrefix="/dashboard/tickets" labelKey="ticketNumber" />
          <ResultSection title="Cases" items={results.cases} hrefPrefix="/dashboard/cases" labelKey="caseNumber" />
          <ResultSection title="Security" items={results.security} hrefPrefix="/dashboard/security/ob" labelKey="logNumber" />
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, items, hrefPrefix, labelKey, subKey }: any) {
  if (!items || items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y text-sm">
          {items.map((item: any) => (
            <li key={item.id}>
              <Link href={`${hrefPrefix}/${item.id}`} className="block px-4 py-2 hover:bg-muted">
                {item[labelKey]} {subKey ? item[subKey] : ""}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
