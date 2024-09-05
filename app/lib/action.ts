'use server';

import fs from "node:fs/promises";
import path from 'path';
import { z } from 'zod'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { randomUUID } from "node:crypto";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.'
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than 0' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string(),
});



const CustomerFormSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, { message: "Please enter a name" }),
  email: z.string()
    .min(1, { message: "Please enter an email" })
    .email({ message: "Invalid email address" }),
  image_url: z.string().min (1, { message: "Only PNG format is allowed" })
});

export type CustomerState = {
  errors?: {
    name?: string[] ;
    email?: string[];
    image_url?: string[]
  };
  message?: string | null;
}

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateCustomer = CustomerFormSchema.omit({ id: true });

const CreateInvoice = FormSchema.omit({ id: true, date: true });

//Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateCustomer = CustomerFormSchema.omit({id:true});


export async function createCustomer(prevState: CustomerState, formData: FormData) {
  
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url')?.toString()
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { name, email } = validatedFields.data;

  const file = formData.get("image_url") as File;
  if (!file) {
    return { message: 'No image uploaded' };
  }
  
   // Generate the file path and write the file
   const uniqueName = `${randomUUID()}-${file.name}`;
   const filePath = path.join('./public/customers', uniqueName);
   const arrayBuffer = await file.arrayBuffer();
   const buffer = new Uint8Array(arrayBuffer);
   await fs.writeFile(filePath, buffer);
 
   // Store the relative URL in the database
   const imageUrl = `/customers/${uniqueName}`;
  

  try {
    await sql`
      INSERT INTO customers (name,email,image_url) VALUES (${name},${email},${imageUrl})`
  } catch (error) {
    return { message: 'Database Error:Failed to create customer' }
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers')
}

export async function createInvoice(prevState: State, formData: FormData) {
  //validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
          INSERT INTO invoices (customer_id,amount,status,date) VALUES (${customerId},${amountInCents},${status},${date})
        `;
  }
  catch (error) {
    return { message: 'Database Error:Failed to create invoice' }
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices')
}

export async function updateCustomer(state:CustomerState | undefined,formData:FormData,id:string){
  const currentState =  state ??{message:null,errors:{}}
  const validatedFields = UpdateCustomer.safeParse({
    name:formData.get('name'),
    email:formData.get('email'),
    image_url:formData.get('image_url')?.toString()
  });
  if (!validatedFields.success) {
    return {
      ...currentState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  const {name,email} = validatedFields.data;
  const file = formData.get("image_url") as File;

  const uniqueName = `${randomUUID()}-${file.name}`;
   const filePath = path.join('./public/customers', uniqueName);
   const arrayBuffer = await file.arrayBuffer();
   const buffer = new Uint8Array(arrayBuffer);
   await fs.writeFile(filePath, buffer);
 
   // Store the relative URL in the database
   const imageUrl = `/customers/${uniqueName}`;
   try{
      await sql`
        UPDATE customers
        SET name=${name},email=${email},image_url=${imageUrl}
        WHERE id=${id}
      `
   }catch (error) {
    return {...currentState, message: 'Database Error:Failed to edit customer' }
  }
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
  return currentState;
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error:Failed to create invoice' }
  }


  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error("fail to delete")
  try {
    await sql`DELETE FROM invoices WHERE id= ${id}`
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error:Failed to delete invoice' }
  }
}

export async function deleteCustomer(id: string) {
  // throw new Error("fail to delete")
  try {
    await sql`DELETE FROM customers WHERE id= ${id}`
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted customer.' };
  } catch (error) {
    return { message: 'Database Error:Failed to delete customer' }
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}