"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formSchema = z.object({
  nameEnglish: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  nameBangla: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  fatherName: z
    .string()
    .min(2, { message: "Father's name must be at least 2 characters." }),
  motherName: z
    .string()
    .min(2, { message: "Mother's name must be at least 2 characters." }),
  nationalId: z
    .string()
    .min(10, { message: "National ID must be at least 10 characters." }),
  nidAddress: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  bloodGroup: z.string().optional(),
  birthPlace: z
    .string()
    .min(2, { message: "Birth place must be at least 2 characters." }),
  userImage: z
    .string()
    .url({ message: "Please enter a valid URL for the user image." }),
  userSign: z
    .string()
    .url({ message: "Please enter a valid URL for the user signature." }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format.",
  }),
  pin: z.string().length(4, { message: "PIN must be exactly 4 characters." }),
});

interface EditUserPageProps {
  nidData: z.infer<typeof formSchema>;
}

export default function EditNidForm({ nidData }: EditUserPageProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...nidData,
      dateOfBirth: new Date(nidData.dateOfBirth).toISOString().split("T")[0],
    },
  });
  console.log(nidData);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle API request for updating user data
    console.log("Submitted Data:", values);
    toast({
      title: "User data updated",
      description: "The user data has been successfully updated.",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit User Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Name (English) */}
          <FormField
            control={form.control}
            name="nameEnglish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Name (Bangla) */}
          <FormField
            control={form.control}
            name="nameBangla"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (Bangla)</FormLabel>
                <FormControl>
                  <Input placeholder="Name in Bangla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Father's Name */}
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Name</FormLabel>
                <FormControl>
                  <Input placeholder="Father's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mother's Name */}
          <FormField
            control={form.control}
            name="motherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mother's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* National ID */}
          <FormField
            control={form.control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>National ID</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address */}
          <FormField
            control={form.control}
            name="nidAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Blood Group */}
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Birth Place */}
          <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Place</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* User Image */}
          <FormField
            control={form.control}
            name="userImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/user-image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* User Signature */}
          <FormField
            control={form.control}
            name="userSign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Signature URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/user-signature.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* PIN */}
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                  <Input type="text" maxLength={4} {...field} />
                </FormControl>
                <FormDescription>Your PIN</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit and Reset Buttons */}
          <div className="flex space-x-4">
            <Button type="submit">Update User Information</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset(nidData)}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
