import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FormField from "../common/FormField";
import { useDispatch } from "react-redux";
import { UserRole } from "@/store/slices/auth/authTypes";
import { useState } from "react";
import { Gauge, Loader2 } from "lucide-react";
import { login, signUp } from "@/store/slices/auth/authThunks";
import { AppDispatch } from "@/store";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  if (type === "sign-up") {
    return z
      .object({
        username: z.string().min(3, {
          message: "Username must be at least 3 characters.",
        }),
        first_name: z.string().min(1, {
          message: "First name is required.",
        }),
        last_name: z.string().min(1, {
          message: "Last name is required.",
        }),
        email: z.string().email({
          message: "Please enter a valid email address.",
        }),
        password: z.string().min(4, {
          message: "Password must be at least 4 characters.",
        }),
        confirm_password: z.string().min(1, {
          message: "Confirm password is required.",
        }),
      })
      .refine((data) => data.password === data.confirm_password, {
        message:
          "Passwords don't match. Please make sure your passwords match.",
        path: ["confirm_password"],
      });
  } else {
    return z.object({
      username: z.string().min(1, {
        message: "Username is required.",
      }),
      password: z.string().min(1, {
        message: "Password is required.",
      }),
    });
  }
};

export default function AuthForm({ type }: { type: FormType }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("MANAGER");
  const formSchema = authFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "sign-up"
        ? {
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
          }
        : {
            username: "",
            password: "",
          },
    mode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === "sign-up") {
      // For TypeScript safety, check if sign-up fields exist
      if (
        "first_name" in values &&
        "last_name" in values &&
        "email" in values &&
        "confirm_password" in values
      ) {
        // Create the signup payload with all fields
        const signupPayload = {
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
          role: selectedRole,
        };

        try {
          setIsLoading(true);
          const resultAction = await dispatch(signUp(signupPayload));

          if (signUp.fulfilled.match(resultAction)) {
            toast.success("Account created successfully");
            form.reset();
            navigate("/sign-in");
          } else {
            const errorData = resultAction.payload as any;
            // Handle object error messages by converting to string
            const errorMessage =
              typeof errorData === "object"
                ? JSON.stringify(errorData)
                : errorData || "Registration failed. Please try again.";
            toast.error(errorMessage);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Registration failed: ${error.message}`);
          }
        } finally {
          setIsLoading(false);
        }
      }
    } else if (type === "sign-in") {
      try {
        setIsLoading(true);

        const resultAction = await dispatch(
          login({
            username: values.username,
            password: values.password,
          })
        );

        // Check if the action was fulfilled (login successful)
        if (login.fulfilled.match(resultAction)) {
          form.reset();
          localStorage.setItem("role", resultAction.payload.role);
          if (resultAction.payload.role === "ADMIN") {
            navigate("/admin/dashboard");
          } else if (resultAction.payload.role === "MANAGER") {
            navigate("/admin/dashboard");
          } else if (resultAction.payload.role === "ENGINEER") {
            navigate("/admin/dashboard");
          }
        }
        if (login.rejected.match(resultAction)) {
          const errorData = resultAction.payload as any;
          // Handle object error messages by converting to string
          const errorMessage =
            typeof errorData === "object"
              ? JSON.stringify(errorData)
              : errorData || "Login failed";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          console.log(error.message);
          toast.error(`Login failed: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className=" rounded-md border border-gray-300 w-[400px] ">
      <div className="flex flex-col gap-3 py-8 px-3 sm:px-6 items-center justify-center bg-gray-800/80 rounded-md ">
        <h1 className="text-2xl font-bold text-center flex items-center ">
          <Gauge className="mr-2 text-accent-color" size={35} /> RozWelControl
        </h1>
        <p>Please enter your details</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => {
              toast.error("Please fill all fields");
            })}
            className="w-full space-y-3 mt-4 "
          >
            <FormField
              control={form.control}
              name="username"
              label="Username"
              placeholder="Username"
              type="text"
              disabled={isLoading}
            />

            {!isSignIn && (
              <>
                <FormField
                  control={form.control}
                  name="first_name"
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  disabled={isLoading}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  label="Last Name"
                  placeholder="Last Name"
                  type="text"
                  disabled={isLoading}
                />
                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="email"
                  disabled={isLoading}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              disabled={isLoading}
            />

            {!isSignIn && (
              <>
                <FormField
                  control={form.control}
                  name="confirm_password"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  type="password"
                  disabled={isLoading}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Role:</label>
                  <div className=" text-sm flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={selectedRole === "MANAGER"}
                        onChange={() => setSelectedRole("MANAGER")}
                        className="size-3"
                        disabled={isLoading}
                      />
                      <span>Manager</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={selectedRole === "ENGINEER"}
                        onChange={() => setSelectedRole("ENGINEER")}
                        className="size-3"
                        disabled={isLoading}
                      />
                      <span>Engineer</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              className=" w-full rounded-md bg-accent-color text-white hover:bg-accent-color/80 "
              disabled={isLoading}
            >
              {isSignIn ? "Sign In" : "Create An Account"}
              {isLoading && <Loader2 className="ml-1 size-5 animate-spin" />}
            </Button>
          </form>
        </Form>
        <p>
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <Link to={isSignIn ? "/sign-up" : "/sign-in"}>
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
