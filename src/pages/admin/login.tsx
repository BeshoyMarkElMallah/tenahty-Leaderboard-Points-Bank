import { type NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Container, Box, TextField, Button, Typography, Alert } from "@mui/material";
import logo from "../../../public/logon.png";
import Image from "next/image";

const AdminLogin: NextPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("adminToken", "authenticated");
        // Redirect to admin dashboard
        await router.push("/admin/dashboard");
      } else {
        setError("كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء المحاولة");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - تيناهتي</title>
        <link rel="icon" href="/logon.png" />
      </Head>

      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 3,
          }}
        >
          <Image src={logo} alt="tenahty" width={150} height={150} />
          
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
            بنك تيناهتي
          </Typography>
          
          <Typography variant="h6" component="h2" sx={{ textAlign: "center", color: "gray" }}>
            لوحة التحكم
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%", gap: 2, display: "flex", flexDirection: "column" }}>
            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || !password}
              sx={{ py: 1.5 }}
            >
              {isLoading ? "جاري التحقق..." : "دخول"}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AdminLogin;
