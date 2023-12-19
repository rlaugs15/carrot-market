import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathName = usePathname();
  console.log(pathName);

  return (
    <div className="flex justify-center space-x-4 my-6">
      <Link href="/" className={pathName === "/" ? "text-yellow-400" : ""}>
        Home
      </Link>
      <Link
        href="/ditail"
        className={pathName === "/ditail" ? "text-yellow-400" : ""}
      >
        ditail
      </Link>
      <Link
        href="/enter"
        className={pathName === "/enter" ? "text-yellow-400" : ""}
      >
        enter
      </Link>
    </div>
  );
}
