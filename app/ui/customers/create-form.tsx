'use client'

import Link from "next/link";
import { Button } from "../button";
import { useActionState, useState } from "react";
import { createCustomer, CustomerState } from "@/app/lib/action";

export default function Form(){
    const initialState : CustomerState = {message:null,errors:{}};
    const [state,formAction] = useActionState(createCustomer,initialState);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image_url: null
      });

      const handleInputChange = (e : any) => {
        const { name, value, files } = e.target;
        setFormData({
          ...formData,
          [name]: files ? files[0] : value
        });
      };
    return (
        <form action={formAction}>
            <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            aria-describedby="name-error"
                            placeholder="Enter customer name"
                            className="w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                        state.errors.name.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
                </div>
                
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            aria-describedby="email-error"
                            placeholder="Enter customer's email"
                            className="w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                        state.errors.email.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
                </div>
                
            </div>
            <div className="mb-4">
                <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                    Profile picture
                </label>
                <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <input 
                            type="file"
                            name="image_url"
                            id="image_url"
                            onChange={handleInputChange}
                            aria-describedby="image-error"
                            className="w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                    </div>
                </div>
                <div id="image-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.image_url &&
                        state.errors.image_url.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                            </p>
                        ))}
                    </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
        </form>
    )
}