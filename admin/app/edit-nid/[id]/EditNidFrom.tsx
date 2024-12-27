"use client";

import { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import generateNid from "@/app/action/generateNid";
// import { useRouter } from "next/navigation";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const idTypes = ["PIN", "NID", "Voter ID"];

export const formSchema = z.object({
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
  nidPresentAddress: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  nidPermanentAddress: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  bloodGroup: z.string().optional(),
  birthPlace: z
    .string()
    .min(2, { message: "Birth place must be at least 2 characters." }),
  userImage: z.string(),
  userSign: z.string(),
  voterNo: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format.",
  }),
  pin: z.string().min(4, { message: "PIN min length 4 characters." }),
  idTypes: z.enum(["PIN", "NID", "Voter ID"], {
    required_error: "ID Type is required",
  }),
  whatsappNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
});

interface EditUserPageProps {
  nidData: z.infer<typeof formSchema> & {
    user: {
      whatsAppNumber: string;
    };
    voterAt: string;
  };
}

export default function EditNidForm({ nidData }: EditUserPageProps) {
  const [imagePreview, setImagePreview] = useState(nidData.userImage);
  const [signPreview, setSignPreview] = useState(nidData.userSign);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...nidData,
      whatsappNumber: nidData.user.whatsAppNumber,
      idTypes: nidData.idTypes || idTypes[1],
    },
  });
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string>>,
    fieldName: keyof z.infer<typeof formSchema>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Ensuring the file is an image
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        form.setValue(fieldName, base64);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a valid image file.",
      });
    }
  };
  // const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const data = {
      birthPlace: values.birthPlace,
      dateOfBirth: values.dateOfBirth,
      fatherName: values.fatherName,
      motherName: values.motherName,
      nameBangla: values.nameBangla,
      nameEnglish: values.nameEnglish,
      nidAddress: values.nidAddress,
      nationalId:
        values.idTypes === "PIN"
          ? values.pin
          : values.idTypes === "NID"
          ? values.nationalId
          : values.idTypes === "Voter ID"
          ? values.voterNo
          : "",
      pin: values.pin,
      userImage: values.userImage,
      userSign: values.userSign,
      whatsAppNumber: values.whatsappNumber,
    };

    try {
      await generateNid(data);
      setSuccess(true);
      toast({
        title: "User data updated",
        description: "The user data has been successfully updated.",
      });
    } catch {
      setError("There was an error updating the user data.");
      toast({
        title: "Error",
        description: "Something went wrong while updating the data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                  <Input placeholder="name bangla" {...field} />
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
                  <Input placeholder="Father's Name" {...field} />
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
                  <Input placeholder="Mother's Name" {...field} />
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
                  <Input placeholder="National ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* present Address */}
          <FormField
            control={form.control}
            name="nidPresentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Present Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address"
                    {...field}
                    className={`${
                      nidData.voterAt === "present"
                        ? "border-blue-700 border-2"
                        : ""
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Permanent Address */}
          <FormField
            control={form.control}
            name="nidPermanentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Permanent Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address"
                    {...field}
                    className={`${
                      nidData.voterAt === "present"
                        ? ""
                        : "border-blue-700 border-2"
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* NID Address */}
          <FormField
            control={form.control}
            name="nidAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
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
                      <SelectValue placeholder="Select Blood Group" />
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
                  <Input placeholder="Birth Place" {...field} />
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
                  <Input placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid justify-center grid-cols-1 sm:grid-cols-2 gap-4 items-center sm:justify-center ">
            {/* User Image */}
            <FormField
              control={form.control}
              name="userImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Image</FormLabel>
                  <FormControl>
                    <div className="flex gap-5 items-center flex-col sm:flex-row">
                      <img
                        src={imagePreview}
                        alt="User"
                        className="w-24 h-auto object-cover "
                      />
                      <label
                        htmlFor="userImage"
                        className="cursor-pointer flex items-center gap-2 text-blue-600"
                      >
                        <FaCloudUploadAlt />
                        <span>Upload Image</span>
                      </label>
                      <Input
                        id="userImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(e, setImagePreview, field.name)
                        }
                      />
                    </div>
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
                  <FormLabel>User Signature</FormLabel>
                  <FormControl>
                    <div className="flex gap-5 items-center flex-col sm:flex-row">
                      <img
                        src={signPreview}
                        alt="Signature"
                        className="w-24 h-auto object-cover "
                      />
                      <label
                        htmlFor="userSign"
                        className="cursor-pointer flex items-center gap-2 text-blue-600"
                      >
                        <FaCloudUploadAlt />
                        <span>Upload Signature</span>
                      </label>
                      <Input
                        id="userSign"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(e, setSignPreview, field.name)
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* PIN */}
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                  <Input placeholder="PIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Voter no */}
          <FormField
            control={form.control}
            name="voterNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voter no</FormLabel>
                <FormControl>
                  <Input placeholder="Voter no" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* ID Type */}
          <FormField
            control={form.control}
            name="idTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Type</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-4 items-center">
                    {idTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer p-2 border rounded-md hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500"
                      >
                        <input
                          type="radio"
                          value={type}
                          checked={field.value === type}
                          onChange={field.onChange}
                          className="form-radio"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* whatsapp number  */}
          <FormField
            control={form.control}
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="WhatsApp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit and Reset Buttons */}
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Sending... this NID With Updated Information"
                : "Send this NID With Updated Information"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset(nidData);
                setImagePreview(nidData.userImage);
                setSignPreview(nidData.userSign);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
      {/* Success/Failure Message */}
      {success && (
        <div className="text-green-600 pt-3">
          Data updated and send successfully!
        </div>
      )}
      {error && <div className="text-red-600 pt-3">{error}</div>}
    </div>
  );
}
