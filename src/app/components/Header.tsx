// "use client";
import { Button, Container, Group } from "@mantine/core";
import Link from "next/link";
import SearchBar from "./searchBar";
import { IconShoppingCart } from "@tabler/icons-react";
import { useAuth } from "../context/context";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; 

const SimpleLayout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}
  >
    {children}
  </div>
);

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); 
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/products");
  };

  const handleUsernameClick = () => {
    if (pathname === "/profile") {
      router.push("/products");
    }else{
      router.push("/profile");
    }
  };
  const path = () => {
    if (pathname === "/profile") {
      return "Home";
    } else {
      return user?.first_name;
    }
  };

  return (
    <Container size="xl" h="100%">
      <Group justify="space-between" h="100%">
        <Link
          href="/products"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Group>
            <span className="font-bold text-xl">Globus Market</span>
          </Group>
        </Link>

        <SearchBar />

        {isAuthenticated ? (
          <Group>
            <Link
              href="/cart"
              style={{ textDecoration: "none", color: "inherit" }}
            >
               <Button  variant="outline" fullWidth>
              <IconShoppingCart size={20} />
            </Button>
            </Link>
            <Button onClick={handleLogout} color="red">
              Выйты
            </Button>
            <Button onClick={handleUsernameClick} variant="outline">
              {path()}
            </Button>
         
          </Group>
        ) : (
          <SimpleLayout>
            <Link
              href="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Group>
                <span className="font-bold text-xl">Login</span>
              </Group>
            </Link>
          </SimpleLayout>
        )}
      </Group>
    </Container>
  );
};

export default Header;
