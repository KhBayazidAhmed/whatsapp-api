import CreateUserForm from "@/components/CreateUserForm";
import Users from "@/components/Users";

export default function CreateAccountPage() {
  return (
    <>
      <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8 mb-9">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <CreateUserForm />
      </div>

      <Users />
    </>
  );
}
