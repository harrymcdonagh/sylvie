import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import UserDropdown from "./UserDropdown";

const CTAs = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  console.log("Session data:", session);

  return (
    <div className="flex items-center gap-3">
      {session?.user ? (
        <UserDropdown
          name={session?.user?.name || "User"}
          email={session.user.email || ""}
          image={session.user.image || undefined}
          onSignOut={handleSignOut}
        />
      ) : (
        <>
          <Link href="/sign-in">
            <button className="flex items-center gap-2 rounded-lg border-2 border-white px-4 py-2 font-semibold text-white transition-colors hover:bg-white hover:text-black">
              <FaUserCircle />
              <span>Sign in</span>
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="rounded-lg border-2 border-orange-400 bg-orange-400 px-4 py-2 font-semibold text-black transition-colors hover:border-orange-600 hover:bg-orange-600 hover:text-white">
              Register
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CTAs;
