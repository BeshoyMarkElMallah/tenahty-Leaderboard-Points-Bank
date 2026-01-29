import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import { trpc } from "../../utils/trpc";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingPrepToggle, setLoadingPrepToggle] = useState(false);
  const [loadingSecToggle, setLoadingSecToggle] = useState(false);
  const [prepScoresEdit, setPrepScoresEdit] = useState<{ [key: string]: string }>({});
  const [secScoresEdit, setSecScoresEdit] = useState<{ [key: string]: string }>({});

  // Queries
  const { data: prepScores, refetch: refetchPrep } = trpc.scores?.prepScores.useQuery();
  const { data: secScores, refetch: refetchSec } = trpc.scores?.secScores.useQuery();

  // Mutations
  const updatePrepScoreMutation = trpc.scores?.updatePrepScore.useMutation({
    onSuccess: () => refetchPrep(),
  });
  const updateSecScoreMutation = trpc.scores?.updateSecScore.useMutation({
    onSuccess: () => refetchSec(),
  });
  const togglePrepVisibilityMutation = trpc.scores?.togglePrepVisibility.useMutation({
    onSuccess: () => refetchPrep(),
  });
  const toggleSecVisibilityMutation = trpc.scores?.toggleSecVisibility.useMutation({
    onSuccess: () => refetchSec(),
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleScoreChange = (
    id: string,
    newPoints: string,
    isPrepGroup: boolean
  ) => {
    if (isPrepGroup) {
      setPrepScoresEdit({ ...prepScoresEdit, [id]: newPoints });
    } else {
      setSecScoresEdit({ ...secScoresEdit, [id]: newPoints });
    }
  };

  const handleSubmitScores = (isPrepGroup: boolean) => {
    const scoresEdit = isPrepGroup ? prepScoresEdit : secScoresEdit;
    const groups = isPrepGroup ? prepScores : secScores;
    const mutation = isPrepGroup ? updatePrepScoreMutation : updateSecScoreMutation;

    Object.entries(scoresEdit).forEach(([id, value]) => {
      const numValue = parseInt(value as string);
      if (!isNaN(numValue)) {
        const group = groups?.find((g: any) => g.id === id);
        if (group) {
          const newPoints = group.points + numValue;
          mutation.mutate({ id, points: newPoints });
        }
      }
    });

    if (isPrepGroup) {
      setPrepScoresEdit({});
    } else {
      setSecScoresEdit({});
    }
  };

  const getDisplayScore = (groupId: string, currentPoints: number, isPrepGroup: boolean) => {
    const scoresEdit = isPrepGroup ? prepScoresEdit : secScoresEdit;
    return scoresEdit[groupId] !== undefined ? scoresEdit[groupId] : '';
  };

  const handleToggleAllVisibility = (isPrepGroup: boolean) => {
    if (!prepScores || !secScores) return;

    const groups = isPrepGroup ? prepScores : secScores;
    const allShown = groups.every((g: any) => g.isShown);
    const mutation = isPrepGroup ? togglePrepVisibilityMutation : toggleSecVisibilityMutation;

    if (isPrepGroup) {
      setLoadingPrepToggle(true);
    } else {
      setLoadingSecToggle(true);
    }

    // Send all mutations
    groups.forEach((group: any) => {
      mutation.mutate({
        id: group.id,
        isShown: !allShown,
      });
    });

    // Reset loading state after a reasonable delay
    setTimeout(() => {
      if (isPrepGroup) {
        setLoadingPrepToggle(false);
      } else {
        setLoadingSecToggle(false);
      }
    }, 1000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>لوحة التحكم - تيناهتي</title>
        <link rel="icon" href="/logon.png" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            لوحة التحكم - إدارة المجموعات
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="مجموعات الإعدادي" />
            <Tab label="مجموعات الثانوي" />
          </Tabs>

          {/* Prep Groups Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color={prepScores?.every((g: any) => g.isShown) ? "success" : "warning"}
                onClick={() => handleToggleAllVisibility(true)}
                disabled={loadingPrepToggle}
              >
                {loadingPrepToggle
                  ? "جاري التحديث..."
                  : prepScores?.every((g: any) => g.isShown)
                  ? "إخفاء الكل"
                  : "إظهار الكل"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmitScores(true)}
                disabled={updatePrepScoreMutation.isLoading || Object.keys(prepScoresEdit).length === 0}
              >
                حفظ النقاط
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      إضافة / طرح نقاط
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      النقاط الحالية
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      اللون
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      اسم المجموعة
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prepScores?.map((group: any) => (
                    <TableRow key={group.id} hover>
                      <TableCell align="center">
                        <TextField
                          type="text"
                          size="small"
                          placeholder="أدخل رقم (موجب أو سالب)"
                          value={getDisplayScore(group.id, group.points, true)}
                          onChange={(e) =>
                            handleScoreChange(
                              group.id,
                              e.target.value,
                              true
                            )
                          }
                          disabled={updatePrepScoreMutation.isLoading}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {group.points}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: group.color,
                            borderRadius: 1,
                            margin: "0 auto",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {group.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Sec Groups Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color={secScores?.every((g: any) => g.isShown) ? "success" : "warning"}
                onClick={() => handleToggleAllVisibility(false)}
                disabled={loadingSecToggle}
              >
                {loadingSecToggle
                  ? "جاري التحديث..."
                  : secScores?.every((g: any) => g.isShown)
                  ? "إخفاء الكل"
                  : "إظهار الكل"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmitScores(false)}
                disabled={updateSecScoreMutation.isLoading || Object.keys(secScoresEdit).length === 0}
              >
                حفظ النقاط
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      إضافة / طرح نقاط
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      النقاط الحالية
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      اللون
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      اسم المجموعة
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secScores?.map((group: any) => (
                    <TableRow key={group.id} hover>
                      <TableCell align="center">
                        <TextField
                          type="text"
                          size="small"
                          placeholder="أدخل رقم (موجب أو سالب)"
                          value={getDisplayScore(group.id, group.points, false)}
                          onChange={(e) =>
                            handleScoreChange(
                              group.id,
                              e.target.value,
                              false
                            )
                          }
                          disabled={updateSecScoreMutation.isLoading}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {group.points}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: group.color,
                            borderRadius: 1,
                            margin: "0 auto",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {group.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
};

export default AdminDashboard;
