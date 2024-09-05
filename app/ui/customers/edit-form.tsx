'use client';

import { Customer } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { CustomerState, updateCustomer} from '@/app/lib/action';
import { useActionState, useState } from 'react';
import Image from 'next/image';


export default function EditCustomerForm({
  customer,
}: {
  customer: Customer;
}) {
    const updateCustomerWithId = (state: CustomerState | undefined, formData: FormData) =>
        updateCustomer(state, formData, customer.id);
      
  const initialState: CustomerState = { message: null, errors: {} }
  const [state,formAction] = useActionState(updateCustomerWithId,initialState);

  const [selectedImage,setSelectedImage] = useState(customer.image_url)
  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
    }
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
                            defaultValue={customer.name}
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
                            defaultValue={customer.email}
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
                        <Image src={selectedImage} 
                                alt={`${customer.name}'s profile picture`} 
                                className='rounded-full mb-3'
                                width={100} 
                                height={200}/>
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
        <Button type="submit">Edit</Button>
      </div>
        </form>
  );
}
