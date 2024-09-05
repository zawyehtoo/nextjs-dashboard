import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import CustomersTable from "@/app/ui/customers/table";
import { fetchCustomersPages, fetchFilteredCustomers } from "@/app/lib/data";
import Pagination from "@/app/ui/invoices/pagination";
import { Suspense } from "react";
import { CustomersTableSkeleton } from "@/app/ui/skeletons";
import { CreateCustomer } from "@/app/ui/customers/buttons";

export default async function Page({
    searchParams,
}: {
    searchParams?:
    {
        query?: string,
        page?: string
    }
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCustomersPages(query)

    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Customers
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
                <CreateCustomer />
            </div>

            <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
                <CustomersTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}